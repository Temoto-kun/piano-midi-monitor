import { app, BrowserWindow, Menu, } from 'electron'
// @ts-ignore
import midi = require('midi')

const SCREEN_HEIGHT = 100
const SCREEN_WIDTH = 52 * 20 + 200

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
      devTools: false,
      nodeIntegration: true,
    }
  })

  win.loadURL('http://localhost:3000')

  const input = new midi.Input()

  if (input.getPortCount() > 0) {
    input.openPort(0)
  }

  input.on('message', (deltaTime: number, message: unknown[]) => {
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

const SPANS = [
  {
    label: '4 octaves (C2 - C6)',
    startKey: 36,
    endKey: 84,
    naturalKeys: 29,
  },
  {
    label: '4 1/2 octaves (C2 - F6)',
    startKey: 36,
    endKey: 89,
    naturalKeys: 33,
  },
  {
    label: '5 octaves (C2 - C7)',
    startKey: 36,
    endKey: 96,
    naturalKeys: 36,
  },
  {
    label: '6 octaves (E1 - G7)',
    startKey: 28,
    endKey: 103,
    naturalKeys: 45,
  },
  {
    label: '7 1/3 octaves (A0 - C8)',
    startKey: 21,
    endKey: 108,
    naturalKeys: 52,
  },
  {
    label: '8 octaves (C0 - C8)',
    startKey: 12,
    endKey: 108,
    naturalKeys: 57,
  },
  {
    label: '9 octaves (C0 - B8)',
    startKey: 12,
    endKey: 119,
    naturalKeys: 63,
  },
  {
    label: 'Full MIDI (C-1 - G9)',
    startKey: 0,
    endKey: 127,
    naturalKeys: 75,
  },
]

const platformMenu = Menu.buildFromTemplate([
  ...<object[]> (
    process.platform === 'darwin'
      ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ],
        }
      ]
      : []
  ),
  {
    label: 'Span',
    submenu: SPANS.map(s => ({
      label: s.label,
      click: (item, browserWindow) => {
        if (typeof browserWindow !== 'undefined') {
          browserWindow!.setContentSize((14 * s.naturalKeys) + 200, SCREEN_HEIGHT)
          browserWindow!.webContents.send('spanchange', `${s.startKey}:${s.endKey}:${s.naturalKeys}`)
        }
      },
    }))
  }
])

Menu.setApplicationMenu(platformMenu)

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
