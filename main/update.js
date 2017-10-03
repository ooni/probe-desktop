const { homedir } = require('os')

const ms = require('ms')
const { getConfig } = require('./util/config')
const { app, autoUpdater } = require('electron')
const isDev = require('electron-is-dev')

const updateBinary = async () => {
  // XXX
}

// This is used to update the ooniprobe-cli
const startBinaryUpdates = () => {
  const binaryUpdateTimer = time =>
    setTimeout(async () => {
      try {
        await updateBinary()
        binaryUpdateTimer(ms('10m'))
      } catch (err) {
        console.log(err)
        binaryUpdateTimer(ms('1m'))
      }
    }, time)

  binaryUpdateTimer(ms('2s'))
}

const startAppUpdates = async mainWindow => {
  let config

  try {
    config = await getConfig()
  } catch (err) {
    config = {}
  }

  const updatedFrom = config.desktop && config.desktop.updatedFrom
  const appVersion = isDev ? version : app.getVersion()

  autoUpdater.on('error', error => {
    console.log('Failed to update')
    console.log(error)
    setTimeout(checkForUpdates, ms('15m'))
  })
  setTimeout(checkForUpdates, ms('10s'))

  autoUpdater.on('update-downloaded', async () => {
    autoUpdater.quitAndInstall()
    app.quit()
  })

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for app updates...')
  })

  autoUpdater.on('update-available', () => {
    console.log('Found update for the app! Downloading...')
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No updates found. Checking again in 5 minutes...')
    setTimeout(checkForUpdates, ms('5m'))
  })

}

export const startAutoUpdater = mainWindow => {
  if (process.platform === 'linux') {
    // Sorry linux, no auto-update for you
    // Maybe we can implement this by downloading binary blobs, I bet the
    // hooded debianists would greatly appreciate this approach.
    return
  }

  startBinaryUpdates()
  if (!isDev) {
    startAppUpdates(mainWindow)
  }
}

export default startAutoUpdater
