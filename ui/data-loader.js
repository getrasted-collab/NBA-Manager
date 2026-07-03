(function initializeGameDataLoader() {
  const dataFiles = {
    teams: "./data/teams.json",
    players: "./data/players.json",
    playerStats: "./data/playerStats.json"
  };

  window.gameData = {
    teams: [],
    players: [],
    playerStats: [],
    loaded: false,
    errors: []
  };

  async function loadJson(key, relativePath) {
    if (Array.isArray(window.nbaLocalData?.[key])) {
      window.gameData[key] = structuredClone(window.nbaLocalData[key]);
      return;
    }

    try {
      const value = await window.nbaManager.loadLocalJson(relativePath);
      if (!Array.isArray(value)) {
        throw new Error(`Expected an array but received ${typeof value}.`);
      }
      window.gameData[key] = value;
    } catch (error) {
      const message = `Failed to load ${relativePath}: ${error?.message || error}`;
      window.gameData.errors.push(message);
      console.error(`[NBA Manager data] ${message}`);
    }
  }

  window.gameData.ready = Promise.all(
    Object.entries(dataFiles).map(([key, relativePath]) => loadJson(key, relativePath))
  ).then(() => {
    window.gameData.loaded = window.gameData.errors.length === 0;
    if (window.gameData.loaded) {
      console.info(
        `[NBA Manager data] Loaded ${window.gameData.teams.length} teams and ` +
          `${window.gameData.playerStats.length} player stat rows from local JSON.`
      );
    }
    return window.gameData;
  });
})();
