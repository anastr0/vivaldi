const { app, BrowserWindow, ipcMain } = require('electron/main')

const path = require('node:path')
const Docker = require('dockerode')
const docker = new Docker() // Automatically finds the socket or pipe

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('index.html')
}

ipcMain.handle('fetch-images', async () => {
  try {
    // Returns an array of image objects
    const images = await docker.listImages()

    // Clean up the data to only send what your UI needs
    return images.map((img) => ({
      id: img.Id.split(':')[1].substring(0, 12), // Short ID
      tags: img.RepoTags || ['<none>'],
      size: (img.Size / 1024 / 1024).toFixed(2) + ' MB',
    }))
  } catch (err) {
    console.error('Docker Error:', err)
    throw new Error('Could not connect to Docker. Is it running?')
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
