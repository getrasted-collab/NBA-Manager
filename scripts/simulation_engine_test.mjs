import fs from "node:fs";
import vm from "node:vm";

const requiredFiles = [
  "data/game-data.js",
  "data/offseason-data.js",
  "ui/roster-data.js",
  "ui/data-loader.js",
  "ui/simulation-engine.js",
  "ui/renderer.js"
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required app file: ${file}`);
  }
}

const gameDataContext = { window: {} };
vm.createContext(gameDataContext);
vm.runInContext(fs.readFileSync("data/game-data.js", "utf8"), gameDataContext);

const data = gameDataContext.window.nbaLocalData;
if (!Array.isArray(data?.teams) || data.teams.length < 30) {
  throw new Error("Bundled game data does not include all NBA teams.");
}
if (!Array.isArray(data?.players) || data.players.length === 0) {
  throw new Error("Bundled game data does not include players.");
}
if (!Array.isArray(data?.playerStats) || data.playerStats.length === 0) {
  throw new Error("Bundled game data does not include player stats.");
}

for (const file of ["ui/data-loader.js", "ui/simulation-engine.js"]) {
  new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
}

console.log(
  `Simulation smoke test passed with ${data.teams.length} teams, ` +
    `${data.players.length} players, and ${data.playerStats.length} stat rows.`
);
