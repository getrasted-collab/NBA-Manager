const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("nbaManager", {
  readSave: () => ipcRenderer.invoke("save:read"),
  writeSave: (save) => ipcRenderer.invoke("save:write", save),
  listSaveSlots: () => ipcRenderer.invoke("slots:list"),
  loadSaveSlot: (slotId) => ipcRenderer.invoke("slots:load", slotId),
  writeSaveSlot: (slotId, save) => ipcRenderer.invoke("slots:write", slotId, save),
  deleteSaveSlot: (slotId) => ipcRenderer.invoke("slots:delete", slotId),
  loadLocalJson: (relativePath) => ipcRenderer.invoke("data:read-json", relativePath),
  openFolder: () => ipcRenderer.invoke("folder:open")
});
