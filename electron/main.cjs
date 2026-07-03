const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const logPath = () => path.join(app.getPath("userData"), "startup.log");
const savePath = () => path.join(app.getPath("userData"), "career.json");
const slotsPath = () => path.join(app.getPath("userData"), "saves.json");
const projectDataPath = () => path.resolve(__dirname, "../data");
let mainWindow = null;

function log(message) {
  try {
    fs.mkdirSync(path.dirname(logPath()), { recursive: true });
    fs.appendFileSync(logPath(), `${new Date().toISOString()} ${message}\n`);
  } catch {
    // Best-effort startup logging only.
  }
}

function createWindow() {
  log("creating window");
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 720,
    minWidth: 980,
    minHeight: 640,
    title: "NBA Manager",
    backgroundColor: "#050506",
    autoHideMenuBar: true,
    fullscreen: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs")
    }
  });

  mainWindow.once("ready-to-show", () => {
    log("window ready to show");
    mainWindow.setFullScreen(true);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setAlwaysOnTop(false);
    }, 1800);
  });

  mainWindow.webContents.on("did-finish-load", () => {
    log("renderer loaded");
    mainWindow.setTitle("NBA Manager");
  });

  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    log(`renderer gone ${details.reason}`);
  });

  mainWindow.on("closed", () => {
    log("main window closed");
    mainWindow = null;
  });

  mainWindow.loadFile(path.join(__dirname, "../index.html")).catch((error) => {
    log(`load failed ${error.stack || error.message}`);
  });
}

app.whenReady().then(() => {
  log("app ready");
  ipcMain.handle("save:read", () => {
    const slots = readSlots();
    return slots[0]?.save ?? null;
  });

  ipcMain.handle("save:write", (_event, save) => {
    writeSlot(save.slotId || "slot-1", save);
  });

  ipcMain.handle("slots:list", () => readSlots().map((slot) => slotSummary(slot)));
  ipcMain.handle("slots:load", (_event, slotId) => readSlots().find((slot) => slot.id === slotId)?.save ?? null);
  ipcMain.handle("slots:write", (_event, slotId, save) => writeSlot(slotId, save));
  ipcMain.handle("slots:delete", (_event, slotId) => {
    const store = { slots: readSlots().filter((slot) => slot.id !== slotId) };
    writeStore(store);
    return store.slots.map((slot) => slotSummary(slot));
  });

  ipcMain.handle("data:read-json", (_event, relativePath) => readProjectJson(relativePath));

  ipcMain.handle("folder:open", () => shell.openPath(app.getPath("userData")));
  createWindow();
});

function readProjectJson(relativePath) {
  const requested = String(relativePath || "").replace(/^\.\//, "");
  const allowed = new Set(["data/teams.json", "data/players.json", "data/playerStats.json"]);
  if (!allowed.has(requested)) {
    throw new Error(`Data file is not allowed: ${requested || "(empty path)"}`);
  }

  const filePath = path.resolve(__dirname, "..", requested);
  if (!filePath.startsWith(projectDataPath() + path.sep)) {
    throw new Error(`Data path escaped the project data directory: ${requested}`);
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Local JSON file is missing: ${filePath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Local JSON file is broken: ${filePath}. ${error.message}`);
  }
}

function readSlots() {
  const store = readStore();
  if (store.slots.length === 0 && fs.existsSync(savePath())) {
    try {
      const legacySave = JSON.parse(fs.readFileSync(savePath(), "utf8"));
      const migrated = makeSlot("slot-1", { ...legacySave, slotId: "slot-1" });
      writeStore({ slots: [migrated] });
      return [migrated];
    } catch (error) {
      log(`legacy migration failed ${error.message}`);
    }
  }
  return store.slots;
}

function readStore() {
  try {
    if (fs.existsSync(slotsPath())) {
      const parsed = JSON.parse(fs.readFileSync(slotsPath(), "utf8"));
      return { slots: Array.isArray(parsed.slots) ? parsed.slots : [] };
    }
  } catch (error) {
    log(`read slots failed ${error.message}`);
  }
  return { slots: [] };
}

function writeStore(store) {
  fs.mkdirSync(path.dirname(slotsPath()), { recursive: true });
  fs.writeFileSync(slotsPath(), JSON.stringify(store, null, 2));
}

function writeSlot(slotId, save) {
  const store = readStore();
  const normalized = makeSlot(slotId, { ...save, slotId });
  const existingIndex = store.slots.findIndex((slot) => slot.id === slotId);
  if (existingIndex >= 0) store.slots[existingIndex] = normalized;
  else store.slots.unshift(normalized);
  writeStore(store);
  return slotSummary(normalized);
}

function makeSlot(slotId, save) {
  return {
    id: slotId,
    name: save.careerName || careerName(save),
    mode: save.mode || "Default",
    teamId: save.activeTeamId || "bos",
    season: save.season || 2026,
    updatedAt: new Date().toISOString(),
    save
  };
}

function slotSummary(slot) {
  return {
    id: slot.id,
    name: slot.name,
    mode: slot.mode,
    teamId: slot.teamId,
    season: slot.season,
    updatedAt: slot.updatedAt,
    wins: slot.save?.teams?.find((team) => team.id === slot.teamId)?.wins || 0,
    losses: slot.save?.teams?.find((team) => team.id === slot.teamId)?.losses || 0
  };
}

function careerName(save) {
  return `${String(save.activeTeamId || "NBA").toUpperCase()} ${save.mode || "Default"} ${save.season || 2026}`;
}

app.on("window-all-closed", () => {
  log("window all closed");
  if (process.platform !== "darwin") app.quit();
});

process.on("uncaughtException", (error) => {
  log(`uncaught ${error.stack || error.message}`);
});

process.on("unhandledRejection", (error) => {
  log(`unhandled ${error && error.stack ? error.stack : error}`);
});
