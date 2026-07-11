const { app, BrowserWindow, ipcMain, session } = require("electron");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.resolve(process.argv[2]);
const ROUTES = (process.argv[3] || "").split(",").filter(Boolean);
app.setPath("userData", fs.mkdtempSync(path.join(os.tmpdir(), "nba-manager-computed-")));

app.whenReady().then(async () => {
  session.defaultSession.webRequest.onBeforeRequest({ urls: ["http://*/*", "https://*/*"] }, (_details, callback) => callback({ cancel: true }));
  for (const channel of ["save:read", "save:write", "slots:load", "slots:write"]) ipcMain.handle(channel, () => null);
  for (const channel of ["slots:list", "slots:delete"]) ipcMain.handle(channel, () => []);
  ipcMain.handle("data:read-json", (_event, relativePath) => JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8")));
  ipcMain.handle("folder:open", () => "");
  const window = new BrowserWindow({ show: false, width: 1440, height: 900, useContentSize: true, webPreferences: { preload: path.join(ROOT, "electron", "preload.cjs") } });
  await window.loadFile(path.join(ROOT, "index.html"));
  await window.webContents.executeJavaScript("new Promise(resolve => setTimeout(resolve, 2200))");
  const result = {};
  for (const route of ROUTES) {
    result[route] = await window.webContents.executeJavaScript(`(() => {
      active=${JSON.stringify(route)}; render();
      return [...document.querySelectorAll('body, body *')].map((node, index) => {
        const style=getComputedStyle(node); const values={};
        for (const property of style) values[property]=style.getPropertyValue(property);
        return { index, tag:node.tagName, id:node.id, classes:[...node.classList].sort(), values };
      });
    })()`);
  }
  fs.writeFileSync(OUTPUT, JSON.stringify(result));
  window.destroy(); app.quit();
}).catch(error => { console.error(error); app.exitCode=1; app.quit(); });
