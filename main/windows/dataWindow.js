/* global require, module */

const windowURL = require('./windowURL')
const electron = require('electron')

const rawDataWindow = (msmtID) => {
  const win = new electron.BrowserWindow({
    width: 1024,
    height: 500,
    title: 'Raw Measurement Data',
    //titleBarStyle: 'hidden-inset',
    show: false,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(windowURL(`raw/${msmtID}`))
  return win
}

const openRawDataWindow = (msmtID) => {
  let window = rawDataWindow(msmtID)

  window.once('closed', () => {
    window = null
  })

  window.once('ready-to-show', () => {
    window.show()
  })
  window.setMenu(null)

  return window
}

module.exports = openRawDataWindow
