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

const { getConfig } = require('./utils/config')
const { startAutoUpdater } = require('./update')

const toggleWindow = require('./windows/toggle')

const {
  mainWindow,
  onboardWindow,
  aboutWindow
} = require('./windows')


require('electron-debug')({showDevTools: true})

// <cargo-cult>Apparently this is needed to prevent garbage collection of the
// tray icon</cargo-cult>
let tray = null

// Set the application name
app.setName('OONI Probe')

process.on('uncaughtException', () => {
  // XXX handle the exception in util/exception
})

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

  await prepareNext('./renderer')

  const windows = {
    main: mainWindow(),
    onboard: onboardWindow(),
    about: aboutWindow()
  }

  startAutoUpdater(windows.main)

  // Make the window instances accessible from everywhere
  global.windows = windows

  const { wasOpenedAtLogin } = app.getLoginItemSettings()

  // XXX Only allow one instance of OONI Probe running
  // at the same time
  if (config._informed_consent === false) {
    windows.onboard.once('ready-to-show', () => {
      toggleWindow(null, windows.onboard)
    })
  } else {
    if (!wasOpenedAtLogin) {
      windows.main.once('ready-to-show', () => {
        toggleWindow(null, windows.main)
      })
    }
  }
})
