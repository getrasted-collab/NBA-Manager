(function installBrowserBridge() {
  if (window.nbaManager) return;

  const STORAGE_KEY = "nba-manager-save-slots";
  const DATABASE_NAME = "nba-manager-careers";
  const DATABASE_VERSION = 1;
  const SLOT_STORE = "save-slots";
  let databasePromise = null;

  function readLegacyStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"slots":[]}');
      const slots = Array.isArray(parsed.slots) ? parsed.slots.filter((slot) => slot && typeof slot === "object") : [];
      return { slots };
    } catch (error) {
      console.error("[NBA Manager saves] Browser save data is broken.", error);
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      return { slots: [] };
    }
  }

  function writeLegacyStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error("[NBA Manager saves] Browser fallback storage is full.", error);
    }
  }

  function openDatabase() {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(SLOT_STORE)) database.createObjectStore(SLOT_STORE, { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Unable to open career database."));
    });
    return databasePromise;
  }

  async function indexedSlots() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(SLOT_STORE, "readonly").objectStore(SLOT_STORE).getAll();
      request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
      request.onerror = () => reject(request.error || new Error("Unable to read career slots."));
    });
  }

  async function putIndexedSlot(slot) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(SLOT_STORE, "readwrite");
      transaction.objectStore(SLOT_STORE).put(slot);
      transaction.oncomplete = () => resolve(slot);
      transaction.onerror = () => reject(transaction.error || new Error("Unable to save career slot."));
    });
  }

  async function deleteIndexedSlot(slotId) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(SLOT_STORE, "readwrite");
      transaction.objectStore(SLOT_STORE).delete(slotId);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Unable to delete career slot."));
    });
  }

  async function readStore() {
    try {
      let slots = await indexedSlots();
      if (!slots.length) {
        const legacy = readLegacyStore().slots;
        if (legacy.length) {
          await Promise.all(legacy.map((slot) => putIndexedSlot(slot)));
          localStorage.removeItem(STORAGE_KEY);
          slots = legacy;
        }
      }
      return { slots };
    } catch (error) {
      console.warn("[NBA Manager saves] Indexed storage unavailable; using browser fallback.", error);
      return readLegacyStore();
    }
  }

  function summary(slot) {
    const team = slot.save?.teams?.find((candidate) => candidate.id === slot.teamId);
    return {
      id: slot.id,
      name: slot.name,
      mode: slot.mode,
      teamId: slot.teamId,
      season: slot.season,
      updatedAt: slot.updatedAt,
      wins: team?.wins || 0,
      losses: team?.losses || 0
    };
  }

  async function writeSaveSlot(slotId, save) {
    const slot = {
      id: slotId,
      name: save.careerName || `${String(save.activeTeamId || "NBA").toUpperCase()} ${save.mode || "Default"}`,
      mode: save.mode || "Default",
      teamId: save.activeTeamId || "bos",
      season: save.season || 2026,
      updatedAt: new Date().toISOString(),
      save: { ...save, slotId }
    };
    try {
      await putIndexedSlot(slot);
    } catch (error) {
      const store = readLegacyStore();
      const index = store.slots.findIndex((candidate) => candidate.id === slotId);
      if (index >= 0) store.slots[index] = slot;
      else store.slots.unshift(slot);
      writeLegacyStore(store);
    }
    return summary(slot);
  }

  window.nbaManager = {
    readSave: async () => (await readStore()).slots[0]?.save || null,
    writeSave: async (save) => writeSaveSlot(save.slotId || "slot-1", save),
    listSaveSlots: async () => (await readStore()).slots.map(summary),
    loadSaveSlot: async (slotId) => (await readStore()).slots.find((slot) => slot.id === slotId)?.save || null,
    writeSaveSlot,
    deleteSaveSlot: async (slotId) => {
      let store;
      try {
        await deleteIndexedSlot(slotId);
        store = await readStore();
      } catch {
        store = readLegacyStore();
        store.slots = store.slots.filter((slot) => slot.id !== slotId);
        writeLegacyStore(store);
      }
      return store.slots.map(summary);
    },
    loadLocalJson: async (relativePath) => {
      const key = relativePath.includes("playerStats") ? "playerStats" : relativePath.includes("players") ? "players" : relativePath.includes("teams") ? "teams" : null;
      if (key && Array.isArray(window.nbaLocalData?.[key])) {
        return structuredClone(window.nbaLocalData[key]);
      }
      const response = await fetch(relativePath, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      try {
        return await response.json();
      } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
      }
    },
    openFolder: async () => {
      console.warn("[NBA Manager] Open Folder is only available in Electron.");
    }
  };
})();
