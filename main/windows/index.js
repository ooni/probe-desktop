const path = require('path')

const electron = require('electron')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

const isWinOS = process.platform === 'win32'

const windowURL = page => {
  if (isDev) {
    return 'http://localhost:8000/' + page
  }
  return path.join('file://', resolve('./renderer/out'), page, 'index.html')
}

export const onboardWindow = () => {
  const win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    title: 'Welcome to OONI Probe',
    //titleBarStyle: 'hidden-inset',
    show: false,
    backgroundColor: '#fff',
    webPreferences: {
      devTools: true
    }
  })

  win.loadURL(windowURL('onboard'))
  return win
}

export const aboutWindow = () => {
  const win = new electron.BrowserWindow({
    width: 360,
    height: 408,
    title: 'About OONI',
    //titleBarStyle: 'hidden-inset',
    show: false,
    backgroundColor: '#fff',
    webPreferences: {
      devTools: true
    }
  })

  win.loadURL(windowURL('about'))
  return win
}

export const mainWindow = () => {
  let windowHeight = 600

  if (isWinOS) {
    windowHeight -= 12
  }

  const win = new electron.BrowserWindow({
    width: 800,
    height: windowHeight,
    title: 'OONI Probe',
    titleBarStyle: 'hidden-inset',
    show: false,
    webPreferences: {
      devTools: true
    }
  })

  win.loadURL(windowURL('home'))
  return win
}

export default {
  mainWindow,
  onboardWindow,
  aboutWindow
}
