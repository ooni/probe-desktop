const { join } = require('path')
const { initConfigFile } = require('../config')
const { getAutorunHomeDir } = require('../paths')
const { readFileSync, writeFileSync } = require('fs-extra')
const path = require('path')

const LATEST_AUTORUN_VERSION = 1

// Initialize OONI_HOME for autorun by generating a fresh config file
// in the OONI_HOME for autorun
// Note: initConfigFile in turn initializes Sentry (again) with no extra effect
initConfigFile({ configFilePath: join(getAutorunHomeDir(), 'config.json') })

const log = require('electron-log')
const winScheduler = require('./windows-scheduler')
const macScheduler = require('./mac-scheduler')
const taskId = process.env.npm_package_build_appId || 'org.ooni.probe-desktop'

const writeAutorunVersion = () => {
  const autorunVersionPath = path.join(getAutorunHomeDir(), 'autorun_version')
  writeFileSync(autorunVersionPath, LATEST_AUTORUN_VERSION.toString(), 'utf-8')
}

const platforms = {
  win32: winScheduler,
  darwin: macScheduler,
  // Add a placeholder module to allow CI tests to run on ubuntu-18.04
  linux: { init: () => {} }
}

const scheduler = platforms[process.platform]

/**
 * Initializes the autorun feature
 * - Check if required files are on disk
 * - (Re)generate files that are missing or removed by an update
 * @param {Object} opts Options
 */
const init = async (opts) => {
  // TODO: Check for platform support right away
  const currentAutorunVersion = getAutorunVersion()
  if (currentAutorunVersion < LATEST_AUTORUN_VERSION) {
    try {
      await scheduler.get(taskId)
      log.debug('Task found.')
      await scheduler.delete(taskId)
      await scheduler.create(taskId)
      writeAutorunVersion()
    } catch (e) {
      // When we don't find the task, there is no need to overwrite the autorun
      // files, since they are going to be written with the latest version once
      // the user enabled autorun for the first time
      log.debug('Task not found')
    }
  }
  await scheduler.init(taskId, opts)
}

const getAutorunStatus = () => {
  return new Promise((resolve, reject) => {
    scheduler.get(taskId).then(() => {
      resolve()
    }).catch(() => {
      reject()
    })
  })
}

const getAutorunVersion = () => {
  const autorunVersionPath = path.join(getAutorunHomeDir(), 'autorun_version')
  try {
    const autorunVersion = readFileSync(autorunVersionPath, 'utf-8')
    return Number(autorunVersion)
  } catch(e) {
    return 0
  }
}

// These task managment methods should be made platform-agnostic
// by either using prototypes or some similar pattern
const scheduleAutorun = () => {
  return new Promise((resolve, reject) => {
    scheduler.get(taskId).then(() => {
      log.debug('Task found.')
      scheduler.delete(taskId).then(() => {
        log.debug('Task deleted.')
      }).catch(e => {
        reject(`Task not deleted: ${e.message}`)
      })
    }).catch((e) => {
      log.debug(`Task not found. Might not have been scheduled before: ${e}`)
    }).finally(() => {
      scheduler.create(taskId).then(() => {
        writeAutorunVersion()
        log.debug('Task created')
        resolve()
      }).catch((e) => {
        reject(`Task creation failed: ${e}`)
      })
    })
  })
}

const disableAutorun = () => {
  return new Promise((resolve, reject) => {
    scheduler.delete(taskId).then(() => {
      log.debug('Task deleted')
      resolve()
    }).catch((e) => {
      log.error(e)
      reject(`Failed to disable autorun: ${e}`)
    })
  })
}

// TODO
// checkIfAlreadyScheduled

module.exports = {
  init,
  getAutorunStatus,
  scheduleAutorun,
  disableAutorun
}
