const path = require('path')

const { format } = require('url')

const electron = require('electron')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

const isWinOS = process.platform === 'win32'

const windowURL = page => {
  if (page.indexOf('/') !== -1 || page.indexOf('\\') !== -1) {
    throw Error('You pesky hax0r!')
  }
  const devPath = `http://localhost:8000/${page}`
  let prodPath = format({
    pathname: resolve(`renderer/out/${page}/index.html`),
    protocol: 'file:',
    slashes: true
  })
  const url = isDev ? devPath : prodPath
  return url
}

const onboardWindow = () => {
  const win = new electron.BrowserWindow({
    width: 860,
    height: 720,
    title: 'Welcome to OONI Probe',
    //titleBarStyle: 'hidden-inset',
    show: false,
    backgroundColor: '#fff',
    webPreferences: {}
  })

  win.loadURL(windowURL('onboard'))
  return win
}

const aboutWindow = () => {
  const win = new electron.BrowserWindow({
    width: 360,
    height: 408,
    title: 'About OONI',
    //titleBarStyle: 'hidden-inset',
    show: false,
    backgroundColor: '#fff',
    webPreferences: {}
  })

  win.loadURL(windowURL('about'))
  return win
}

const mainWindow = () => {
  let windowHeight = 640

  if (isWinOS) {
    windowHeight -= 12
  }

  const win = new electron.BrowserWindow({
    width: 1024,
    height: windowHeight,
    title: 'OONI Probe',
    titleBarStyle: 'hidden-inset',
    show: false,
    webPreferences: {}
  })

  win.loadURL(windowURL('home'))
  return win
}

module.exports = {
  mainWindow,
  onboardWindow,
  aboutWindow
}
