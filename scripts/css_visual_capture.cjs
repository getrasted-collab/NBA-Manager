const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.resolve(process.argv[2] || path.join(os.tmpdir(), "nba-manager-css-visual"));
const ROUTES = (process.argv[3] || "start,team-select,saves").split(",");
app.setPath("userData", fs.mkdtempSync(path.join(os.tmpdir(), "nba-manager-visual-")));

app.whenReady().then(async () => {
  ipcMain.handle("save:read", () => null);
  ipcMain.handle("save:write", () => null);
  ipcMain.handle("slots:list", () => []);
  ipcMain.handle("slots:load", () => null);
  ipcMain.handle("slots:write", () => null);
  ipcMain.handle("slots:delete", () => []);
  ipcMain.handle("data:read-json", (_event, relativePath) => JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8")));
  ipcMain.handle("folder:open", () => "");
  fs.mkdirSync(OUTPUT, { recursive: true });
  const window = new BrowserWindow({ show: false, width: 1440, height: 900, useContentSize: true, webPreferences: { preload: path.join(ROOT, "electron", "preload.cjs") } });
  await window.loadFile(path.join(ROOT, "index.html"));
  await window.webContents.executeJavaScript("new Promise(resolve => setTimeout(resolve, 2200))");
  for (const route of ROUTES) {
    await window.webContents.executeJavaScript(`active=${JSON.stringify(route)};render()`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fs.writeFileSync(path.join(OUTPUT, `${route}.png`), (await window.webContents.capturePage()).toPNG());
  }
  window.destroy();
  app.quit();
}).catch((error) => { console.error(error); app.exitCode = 1; app.quit(); });
