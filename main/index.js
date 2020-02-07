/* global require, process, global */

// Packages
const { app, Menu } = require('electron')
const prepareNext = require('electron-next')
const { is } = require('electron-util')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')

const fixPath = require('fix-path')
const { getConfig } = require('./utils/config')
const { getSentryConfig } = require('./utils/sentry')

const log = require('electron-log')

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

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

// To prevent garbage collection of the windows
let windows = null

// Set the application name
app.setName('OONI Probe')

// TODO verify if this code is redundant as the Sentry.init code should already
// cover this.
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

const editMenu = {
  label: 'Edit',
  submenu: [
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
  ]
}

let menuTemplate = [
  {
    label: 'About',
    submenu: [
      { label: 'About OONI Probe', click: () => openAboutWindow() },
    ]
  }, editMenu
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
    }, editMenu
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

function sendStatusToWindow(text) {
  const aboutWindow = openAboutWindow()
  log.info(text)
  aboutWindow.webContents.send('update-message', text)
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', () => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', () => {
  sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  sendStatusToWindow(log_message)
})
autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded. Quitting and installing.')
  autoUpdater.quitAndInstall()
})

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  autoUpdater.checkForUpdatesAndNotify()

  let config
  try {
    config = await getConfig()
  } catch(err) {
    config = {}
  }

  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      /* eslint-disable no-console */
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err))
      /* eslint-enable no-console */
  }

  if (config._is_beta === true) {
    // XXX do something like delete all the measurements on a fresh launch.
  }

  await prepareNext('./renderer')

  windows = {
    main: mainWindow()
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
  // Make the window instances accessible from everywhere
  global.windows = windows

  const { wasOpenedAtLogin } = app.getLoginItemSettings()

  // XXX Only allow one instance of OONI Probe running
  // at the same time
  if (!wasOpenedAtLogin) {
    if (config._informed_consent !== true) {
      windows.main.loadURL(windowURL('onboard'))
    }
    windows.main.once('ready-to-show', () => {
      toggleWindow(null, windows.main)
    })
  }
})
