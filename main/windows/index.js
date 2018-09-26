/* global require, module, process */

const electron = require('electron')

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
    webPreferences: {}
  })

  win.loadURL(windowURL('home'))
  return win
}

module.exports = {
  mainWindow,
  openAboutWindow,
  windowURL
}
