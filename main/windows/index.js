/* global require, module, process */

const electron = require('electron')
const { resolve } = require('app-root-path')

const isWinOS = process.platform === 'win32'

const windowURL = require('./windowURL')

const openAboutWindow = require('./aboutWindow')

const mainWindow = () => {
  let windowHeight = 640

  if (isWinOS) {
    windowHeight -= 12
  }

  const win = new electron.BrowserWindow({
    width: 1024,
    height: windowHeight,
    title: 'OONI Probe',
    titleBarStyle: 'hiddenInset',
    show: false,
    preload: resolve('main/utils/sentry.js'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  log.info('Loading main window.')
  win.loadURL(windowURL(url))
  return win
}

module.exports = {
  mainWindow,
  openAboutWindow,
  windowURL
}
