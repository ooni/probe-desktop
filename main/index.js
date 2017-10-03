// Native
const { format } = require('url')
const { spawn } = require('child_process')

const MK_BIN = '../measurement-kit/measurement_kit'

// Packages
const { BrowserWindow, app, ipcMain } = require('electron')
const prepareNext = require('electron-next')

const fixPath = require('fix-path')
const firstRun = require('first-run')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

const { getConfig } = require('./util/config')
const { startAutoUpdater } = require('./update')

// <cargo-cult>Apparently this is needed to prevent garbage collection of the
// tray icon</cargo-cult>
let tray = null

// Set the application name
app.setName('OONI Probe')

process.on('uncaughtException', () => {
  // XXX handle the exception in util/exception
})

// <cargo-cult>
// Hide dock icon before the app starts
// This is only required for development because
// we're setting a property on the bundled app
// in production, which prevents the icon from flickering
// </cargo-cult>
if (isDev && process.platform === 'darwin') {
  app.dock.hide()
}

if (!isDev && firstRun()) {
 app.setLoginItemSettings({
    openAtLogin: true
  })
}

// This set $PATH properly based on .zsrch/.bashrc/etc.
fixPath()

app.on('window-all-closed', () => {
  // On macOS it's normal to quit the app only when you do apple-Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  let config
  try {
    config = await getConfig()
  } catch(err) {
    config = {}
  }

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  const devUrl = 'http://localhost:8000/home'

  const prodUrl = format({
    pathname: resolve('renderer/out/home/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devUrl : prodUrl
  await prepareNext('./renderer')

  startAutoUpdater(mainWindow)

  if (config._informed_consent === false) {
    // XXX Go through the onboarding
  } else {
    mainWindow.loadURL(url)
  }
})

