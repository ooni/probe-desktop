/*** CRITICAL CODE FOR AUTO-UPDATE STARTS ***/
/*
  This section contains critical code that handles automatically updating
  the app based on Github releases. Bugs in this part of the code can
  have serious consequences like blocking users from receiving critical
  and timely updates. When making changes to this section, please execise
  extra caution and mandatorily get the changes reviewed by another team
  member.
*/

const { openAboutWindow } = require('./windows')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
const semver = require('semver')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false

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
  if (aboutWindow.isVisible()) {
    aboutWindow.webContents.send('update-progress', progressObj)
  } else {
    aboutWindow.webContents.on('did-finish-load', () => {
      aboutWindow.webContents.send('update-progress', progressObj)
    })
  }
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
  sendStatusToWindow('Unable to check for updates. Please visit https://ooni.org/ to get the latest version.')
  log.error(err)
})

autoUpdater.on('download-progress', progressObj => {
  sendUpdaterProgress(progressObj)
})

autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded. Quitting and installing.')
  autoUpdater.quitAndInstall()
})

// Instead of calling autoUpdater.checkForUpdatesAndNotify(), we separate the
// check and download actions to avoid uncatchable exceptions triggered by connectivity problems.
// See ooni/probe#1318
// From https://github.com/electron-userland/electron-builder/issues/2398#issuecomment-413117520
function checkForUpdatesAndInstall() {

  autoUpdater.checkForUpdates().then((info) => {
    // If the check returns something, make sure the new version is
    // greater than the current version, and then initiate download.
    if (semver.gt(info.updateInfo.version, autoUpdater.currentVersion.version, { includePrerelease: true })) {
      downloadUpdate(info.cancellationToken)
    } else {
      log.info('No updates available')
    }
  }).catch((error) => {
    if (isNetworkError(error)) {
      log.info('Network Error')
    } else {
      log.info('Unknown Error')
      log.info(error == null ? 'unknown' : (error.stack || error).toString())
    }
  })
}

function downloadUpdate(cancellationToken) {
  autoUpdater.downloadUpdate(cancellationToken).then(() => {
    setImmediate(() => autoUpdater.quitAndInstall())
  }).catch((error) => {
    if (isNetworkError(error)) {
      log.info('Network Error')
    } else {
      log.info('Unknown Error')
      log.info(error == null ? 'unknown' : (error.stack || error).toString())
    }
  })
}

function isNetworkError(errorObject) {
  return (
    errorObject.message === 'net::ERR_INTERNET_DISCONNECTED' ||
    errorObject.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
    errorObject.message === 'net::ERR_CONNECTION_RESET' ||
    errorObject.message === 'net::ERR_CONNECTION_CLOSE' ||
    errorObject.message === 'net::ERR_NAME_NOT_RESOLVED' ||
    errorObject.message === 'net::ERR_CONNECTION_TIMED_OUT'
  )
}

module.exports = {
  checkForUpdatesAndInstall
}