const electron = require('electron')
const { join } = require('path')
const { resolve } = require('app-root-path')

const isWinOS = process.platform === 'win32'

const windowURL = require('./windowURL')

const openAboutWindow = require('./aboutWindow')

const mainWindow = (url = 'dashboard') => {
  let windowHeight = 640

  if (isWinOS) {
    windowHeight += 50
  }

  const win = new electron.BrowserWindow({
    width: 1024,
    height: windowHeight,
    title: 'OONI Probe',
    titleBarStyle: 'hiddenInset',
    show: false,
    preload: resolve('main/utils/sentry.js'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      sandbox: false,
    }
  })
  win.loadURL(windowURL(url))
  return win
}

module.exports = {
  mainWindow,
  openAboutWindow,
  windowURL
}
