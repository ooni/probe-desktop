/* global require, process, global */

// Packages
const { app, Menu } = require('electron')
const prepareNext = require('electron-next')
const { is } = require('electron-util')

const fixPath = require('fix-path')
const { getConfig } = require('./utils/config')
const { getSentryConfig } = require('./utils/sentry')
const { startAutoUpdater } = require('./update')

const toggleWindow = require('./windows/toggle')

const {
  mainWindow,
  openAboutWindow,
  windowURL
} = require('./windows')

const Sentry = require('@sentry/electron')
Sentry.init(getSentryConfig())

require('debug-to-file')
require('electron-unhandled')()
require('electron-debug')({
  showDevTools: true,
  // null means activate it only if isDev == true. FORCE_ELECTRON_DEBUG will
  // make sure it's always enabled even in "production" builds.
  enabled: parseInt(process.env.FORCE_ELECTRON_DEBUG, 10) === 1 ? true : null
})


// To prevent garbage collection of the windows
let windows = null

// Set the application name
app.setName('OONI Probe')

process.on('uncaughtException', error => {
  Sentry.captureException(error)
})

// XXX currently disable starting at login. It's a bit annoying while developing.
/*
const firstRun = require('first-run')
const isDev = require('electron-is-dev')
const { resolve } = require('app-root-path')

if (!isDev && firstRun()) {
 app.setLoginItemSettings({
    openAtLogin: true
  })
}
*/


let menuTemplate = [
  {
    label: 'BETA',
    submenu: [
      { label: 'About OONI Probe', click: () => openAboutWindow() },
    ]
  }
]
if (is.macos) {
  menuTemplate = [
    {
      label: app.getName(),
      submenu: [
        { label: 'About OONI Probe', click: () => openAboutWindow() },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  ]
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

  if (config._is_beta === true) {
    // XXX do something like delete all the measurements on a fresh launch.
  }

  await prepareNext('./renderer')

  windows = {
    main: mainWindow()
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

  startAutoUpdater(windows.main)

  // Make the window instances accessible from everywhere
  global.windows = windows

  const { wasOpenedAtLogin } = app.getLoginItemSettings()

  // XXX Only allow one instance of OONI Probe running
  // at the same time
  if (!wasOpenedAtLogin) {
    if (config._informed_consent !== true) {
      windows.main.loadURL(windowURL('onboard'))
    }
    if (config._is_beta === true) {
      toggleWindow(null, openAboutWindow())
    }
    windows.main.once('ready-to-show', () => {
      toggleWindow(null, windows.main)
    })
  }
})
