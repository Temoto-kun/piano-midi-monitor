import { app, BrowserWindow, Menu, ipcMain, } from 'electron'
import path from 'path'
import fs from 'fs'

import SPANS from './services/spans.json'
import SCALE_FACTORS from './services/scaleFactors.json'
import { _ } from './services/messages'
import getKeyName from './services/getKeyName'
import getNaturalKeyCount from './services/getNaturalKeyCount'
import Config from './services/Config'
// @ts-ignore
import electronIsDev = require('electron-is-dev')
// @ts-ignore
import midi = require('midi')
// @ts-ignore

const WINDOW_HEIGHT = 100

let config: Config = {
  startKey: 21,
  endKey: 108,
  scaleFactor: 1,
}

const createWindow = () => {
  const KEYS_WIDTH = getNaturalKeyCount(config.startKey, config.endKey) * 20
  const WINDOW_WIDTH = KEYS_WIDTH + 207
  const win = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    useContentSize: true,
    backgroundColor: '#000000',
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false,
    webPreferences: {
      devTools: electronIsDev,
      nodeIntegration: true,
    },
  })

  const baseUrl: string = (
    electronIsDev
      ? 'http://localhost:3000'
      : `file:///${path.join(__dirname, '../build/index.html')}`
  )

  const search = new URLSearchParams(config as Record<string, string>)
  const url = new URL(baseUrl)
  url.search = search.toString()
  win.loadURL(url.toString())

  if (electronIsDev) {
    win.webContents.openDevTools()
  }

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

app
  .whenReady()
  .then(() => {
    try {
      const configJsonRaw = fs.readFileSync('./config.json').toString('utf-8')
      config = JSON.parse(configJsonRaw)
    } catch (e) {
      config = {
        startKey: 21,
        endKey: 108,
        scaleFactor: 1,
      }
    }

    const platformMenu = Menu.buildFromTemplate([
      ...(
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
      ) as object[],
      {
        label: _('VIEW'),
        submenu: [
          {
            label: _('SPAN'),
            submenu: SPANS.map(s => ({
              label: `${getKeyName(s.startKey)}–${getKeyName(s.endKey)}`,
              sublabel: `${s.endKey - s.startKey + 1}-key`,
              type: 'radio',
              checked: config.startKey === s.startKey && config.endKey === s.endKey,
              click: () => {
                config.startKey = s.startKey
                config.endKey = s.endKey
                app.relaunch({
                  args: process.argv.slice(1).concat([
                    `--startKey=${config.startKey}`,
                    `--endKey=${config.endKey}`,
                    `--scaleFactor=${config.scaleFactor}`,
                  ])
                })
                app.exit(0)
              },
            }))
          },
          {
            label: _('DETAIL_SCALE_FACTOR'),
            submenu: SCALE_FACTORS.map(s => ({
              label: `${s}×`,
              type: 'radio',
              checked: config.scaleFactor === s,
              click: () => {
                config.scaleFactor = s

                app.relaunch({
                  args: process.argv.slice(1).concat([
                    `--startKey=${config.startKey}`,
                    `--endKey=${config.endKey}`,
                    `--scaleFactor=${config.scaleFactor}`,
                  ])
                })
                app.exit(0)
              },
            })),
          },
        ]
      },
      ...(
        electronIsDev
          ? [
            {
              label: _('DEBUG'),
              submenu: [
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
              ]
            }
          ]
          : []
      ) as object[]
    ])

    Menu.setApplicationMenu(platformMenu)
    createWindow()

    ipcMain.on('quit', () => {
      app.quit()
    })
  })

app.on('quit', () => {
  fs.writeFileSync('./config.json', JSON.stringify(config))
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
