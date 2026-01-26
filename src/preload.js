const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('vivaldi', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
  getDockerImages: () => ipcRenderer.invoke('fetch-images'),
})

// TODO : provide docker compose script as components
//
