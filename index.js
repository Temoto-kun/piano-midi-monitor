const { app, BrowserWindow } = require('electron')
const midi = require('midi')

const SCREEN_HEIGHT = 64
const SCREEN_WIDTH = 1200

const createWindow = () => {
  const win = new BrowserWindow({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    useContentSize: true,
    backgroundColor: '#000000',
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      //devTools: false,
      nodeIntegration: true,
    }
  })

  win.loadFile('index.html')

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
