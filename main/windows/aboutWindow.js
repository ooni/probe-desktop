const electron = require('electron')
const windowURL = require('./windowURL')
const { join } = require('path')

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
      // contextIsolation: false,
      // nodeIntegration: true,
      enableRemoteModule: true,
      preload: join(__dirname, 'preload.js'),
    }
  })

  win.loadURL(windowURL('about'))
  return win
}

const openAboutWindow = (getFocus) => {
  if (window !== null) {
    if (getFocus) {
      window.focus()
    }
    return window
  }

  window = aboutWindow()

  window.once('closed', () => {
    window = null
  })

  window.once('ready-to-show', () => {
    if (getFocus) {
      window.show()
    } else {
      window.showInactive()
    }
  })
  window.setMenu(null)

  return window
}

module.exports = openAboutWindow
