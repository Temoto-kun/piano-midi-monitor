const { app, BrowserWindow } = require('electron')
const midi = require('midi')

const SCREEN_HEIGHT = 96
const SCREEN_WIDTH = 1152

const createWindow = () => {
  const win = new BrowserWindow({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('pages/piano.html')

  const input = new midi.Input()

  if (input.getPortCount() > 0) {
    input.openPort(0)
  }

  input.on('message', (deltaTime, message) => {
    const [type, data1, data2] = message
    switch (type) {
      case 144:
        win.webContents.send('note', data1 + ':' + data2)
        break
      case 176:
        win.webContents.send('pedal', data1 + ':' + data2)
        break
    }
  })
}

app
  .whenReady()
  .then(() => {
    createWindow()
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
