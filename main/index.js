// Packages
const { app, Menu, ipcMain } = require('electron')
const prepareNext = require('electron-next')
const { is } = require('electron-util')
const isDev = require('electron-is-dev')
const fixPath = require('fix-path')
const Sentry = require('@sentry/electron')
const log = require('electron-log')
log.transports.console.level = isDev ? 'debug' : 'info'
log.transports.file.level = 'debug'

const { getConfig, maybeMigrate, initConfigFile } = require('./utils/config')
const { mainWindow, openAboutWindow } = require('./windows')
const toggleWindow = require('./windows/toggle')
const { ipcBindingsForMain } = require('./ipcBindings')
const initializeSentry = require('./utils/sentry')
const store = require('./utils/store')
const updater = require('./updater')
const autorun = require('./utils/autorun/schedule')

log.info(`Initializing ${app.name} in ${isDev? 'development': 'production'} mode.`)

// Prevent a second instance from launching

if (!app.requestSingleInstanceLock()) {
  log.info('Second instance not allowed. Quitting.')
  app.quit()
}
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

// To prevent garbage collection of the windows
let windows = null

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

Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

// This set $PATH properly based on .zsrch/.bashrc/etc.
fixPath()

app.on('window-all-closed', () => {
  // On macOS it's normal to quit the app only when you do apple-Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const createWindow = async (url) => {
  windows = {
    main: mainWindow(url)
  }

  // Make the window instances accessible from everywhere
  global.windows = windows

  windows.main.once('ready-to-show', () => {
    toggleWindow(null, windows.main)
  })
}

// Prepare the renderer once the app is ready
app.whenReady().then(async () => {
  // Check for any updates
  // Auto update is not yet available for Linux
  if (process.platform === 'darwin' || process.platform === 'win32') {
    // Skip in dev mode
    if (!isDev) {
      updater.checkForUpdatesAndInstall()
    }
  }

  // Setup devtools in development mode
  if (isDev && process.env.NODE_ENV !== 'test') {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      /* eslint-disable no-console */
      .then(name => log.info(`Added Extension:  ${name}`))
      .catch(err => log.error('An error occurred: ', err))
    /* eslint-enable no-console */
  }

  // Start nextjs devServer or static file server in production
  await prepareNext('./renderer')


  // wire up IPC event handlers to the mainWindow
  ipcBindingsForMain(ipcMain)

  try {
    await maybeMigrate()
  } catch (err) {
    Sentry.withScope((scope) => {
      scope.setTag('context', 'config-migration')
      Sentry.captureException(err)
    })
    await initConfigFile()
  }
  const config = await getConfig()

  // Initialize autorun
  autorun.init()

  // XXX Only allow one instance of OONI Probe running
  // at the same time
  const { wasOpenedAtLogin } = app.getLoginItemSettings()
  if (!wasOpenedAtLogin) {

    // Initiate onboarding if informed consent is not given or not available
    if (config !== null && config['_informed_consent'] === true) {
      log.info('Informed consent found in config file.')
      await createWindow()
    } else {
      try {
        if (!config) {
          throw new Error('Configuration not found')
        } else if (typeof config['_informed_consent'] === 'undefined') {
          throw new Error('Informed consent information unavailable')
        } else if (config['_informed_consent'] !== true) {
          throw new Error('Informed consent not given')
        }
      } catch (e) {
        log.info(e.message)
        await createWindow('onboard')
      }
    }
  }
})

app.on('activate', async (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    await createWindow()
  }
})

app.on('second-instance', () => {
  if (windows.main) {
    if (windows.main.isMinimized()) {
      windows.main.restore()
    }
    windows.main.focus()
  }
})
