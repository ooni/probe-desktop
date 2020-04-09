/* global require, module */

const windowURL = require('./windowURL')
const electron = require('electron')

let window = null

const aboutWindow = () => {
  const win = new electron.BrowserWindow({
    width: 400,
    height: 600,
    title: 'About OONI',
    //titleBarStyle: 'hidden-inset',
    show: false,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(windowURL('about'))
  return win
}

const openAboutWindow = () => {
  if (window !== null) {
    window.focus()
    return window
  }

  window = aboutWindow()

  window.once('closed', () => {
    window = null
  })

  window.once('ready-to-show', () => {
    window.show()
  })
  window.setMenu(null)

  return window
}

module.exports = openAboutWindow
