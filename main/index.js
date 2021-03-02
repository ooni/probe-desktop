// Packages
const { app, Menu, ipcMain } = require('electron')
const prepareNext = require('electron-next')
const { is } = require('electron-util')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')

const fixPath = require('fix-path')
const Sentry = require('@sentry/electron')
const log = require('electron-log')

const { getConfig, maybeMigrate, initConfigFile } = require('./utils/config')
const { mainWindow, openAboutWindow, windowURL } = require('./windows')
const toggleWindow = require('./windows/toggle')
const { ipcBindingsForMain } = require('./ipcBindings')
const initializeSentry = require('./utils/sentry')
const store = require('./utils/store')

log.transports.console.level = 'info'
log.transports.file.level = 'debug'

// Get sentry up and running (if already)
initializeSentry()

// initialize store in app.getPath('userData')/settings.json
store.init()

require('debug-to-file')
require('electron-unhandled')()
require('electron-debug')({
  showDevTools: isDev && process.env.NODE_ENV !== 'test',
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
app.name = 'OONI Probe'

app.allowRendererProcessReuse = true

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
    label: app.name,
    submenu: [
      { label: 'About OONI Probe', click: () => openAboutWindow(true) }
    ]
  },
  editMenu
]
if (is.macos) {
  menuTemplate = [
    {
      label: app.name,
      submenu: [
        { label: 'About OONI Probe', click: () => openAboutWindow() },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    editMenu
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

function sendStatusToWindow(text, options = {}) {
  const aboutWindow = openAboutWindow(options['showWindow'] === true)
  log.info(text)
  if (aboutWindow.isVisible()) {
    aboutWindow.webContents.send('update-message', text)
  } else {
    aboutWindow.webContents.on('did-finish-load', () => {
      aboutWindow.webContents.send('update-message', text)
    })
  }
}

function sendUpdaterProgress(progressObj, options = {}) {
  const aboutWindow = openAboutWindow(options['showWindow'] === true)
  log.info(`Update download progress: ${progressObj.percent}`)
  aboutWindow.webContents.on('did-finish-load', () => {
    aboutWindow.webContents.send('update-progress', progressObj)
  })
}

autoUpdater.on('update-not-available', () => {
  log.info('You are up to date')
})

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update')
})

autoUpdater.on('update-available', () => {
  sendStatusToWindow('A new update is available. Downloading now...', { showWindow: true })
})

autoUpdater.on('error', err => {
  sendStatusToWindow('Error in auto-updater. ' + err)
  throw err
})

autoUpdater.on('download-progress', progressObj => {
  sendUpdaterProgress(progressObj)
})

autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded. Quitting and installing.')
  autoUpdater.quitAndInstall()
})

// Prepare the renderer once the app is ready
app.on('ready', async () => {

  // Auto update is not yet available for Linux
  if (process.platform === 'darwin' || process.platform === 'win32') {
    autoUpdater.checkForUpdatesAndNotify()
  }

  if (isDev && process.env.NODE_ENV !== 'test') {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      /* eslint-disable no-console */
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err))
    /* eslint-enable no-console */
  }

  await prepareNext('./renderer')

  windows = {
    main: mainWindow()
  }

  // wire up IPC event handlers to the mainWindow
  ipcBindingsForMain(ipcMain)

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
  // Make the window instances accessible from everywhere
  global.windows = windows

  const { wasOpenedAtLogin } = app.getLoginItemSettings()
  try {
    await maybeMigrate()
  } catch (err) {
    Sentry.withScope((scope) => {
      scope.setTag('context', 'config-migration')
      Sentry.captureException(err)
    })
    initConfigFile()
  }
  const config = await getConfig()
  // XXX Only allow one instance of OONI Probe running
  // at the same time
  if (!wasOpenedAtLogin) {

    // Initiate onboarding if informed consent is not given or not available
    try {
      if (!config) {
        throw new Error('Configuration not found')
      } else if (typeof config['_informed_consent'] === 'undefined') {
        throw new Error('Informed consent information unavailable')
      } else if (config['_informed_consent'] !== true) {
        throw new Error('Informed consent not given')
      }
      if (config['_informed_consent'] === true) {
        log.info('Informed consent found in config file.')
      }
    } catch (e) {
      log.info(e.message)
      windows.main.loadURL(windowURL('onboard'))
    }

    windows.main.once('ready-to-show', () => {
      toggleWindow(null, windows.main)
    })
  }
})
