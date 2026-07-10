const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "Docs", "css-runtime-coverage.json");
const ROUTES = ["start", "team-select", "saves", "dashboard", "play", "standings", "postseason", "offseason", "inventory", "rotation", "strategy", "development", "locker", "upgrade", "quests", "staff", "finances", "trade", "transactions", "scouting", "stats", "awards", "history", "god mode", "settings"];

app.setPath("userData", fs.mkdtempSync(path.join(os.tmpdir(), "nba-manager-css-audit-")));

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

app.whenReady().then(async () => {
  ipcMain.handle("save:read", () => null);
  ipcMain.handle("save:write", () => null);
  ipcMain.handle("slots:list", () => []);
  ipcMain.handle("slots:load", () => null);
  ipcMain.handle("slots:write", () => null);
  ipcMain.handle("slots:delete", () => []);
  ipcMain.handle("data:read-json", (_event, relativePath) => readJson(relativePath));
  ipcMain.handle("folder:open", () => "");

  const window = new BrowserWindow({
    show: false,
    width: 1440,
    height: 900,
    webPreferences: { preload: path.join(ROOT, "electron", "preload.cjs") }
  });
  await window.loadFile(path.join(ROOT, "index.html"));
  await window.webContents.executeJavaScript("new Promise(resolve => setTimeout(resolve, 2200))");

  const coverage = {};
  for (const route of ROUTES) {
    coverage[route] = await window.webContents.executeJavaScript(`(() => {
      active = ${JSON.stringify(route)};
      render();
      const nodes = [document.documentElement, document.body, ...document.querySelectorAll('*')];
      return {
        classes: [...new Set(nodes.flatMap(node => [...node.classList]))].sort(),
        ids: [...new Set(nodes.map(node => node.id).filter(Boolean))].sort()
      };
    })()`);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), routes: coverage }, null, 2)}\n`);
  console.log(`Captured runtime selector coverage for ${ROUTES.length} routes.`);
  window.destroy();
  app.quit();
}).catch((error) => {
  console.error(error);
  app.exitCode = 1;
  app.quit();
});
