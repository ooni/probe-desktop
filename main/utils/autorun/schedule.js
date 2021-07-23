const { join } = require('path')
const { initConfigFile } = require('../config')
const { getAutorunHomeDir } = require('../paths')

// Initialize OONI_HOME for autorun by generating a fresh config file
// in the OONI_HOME for autorun
// Note: initConfigFile in turn initializes Sentry (again) with no extra effect
initConfigFile({ configFilePath: join(getAutorunHomeDir(), 'config.json') })


const log = require('electron-log')
const winScheduler = require('./windows-scheduler')
const macScheduler = require('./mac-scheduler')
const taskId = process.env.npm_package_build_appId || 'org.ooni.probe-desktop'

const platforms = {
  win32: winScheduler,
  darwin: macScheduler
}

const scheduler = platforms[process.platform]

/**
 * Initializes the autorun feature
 * - Check if required files are on disk
 * - (Re)generate files that are missing or removed by an update
 * @param {Object} opts Options
 */
const init = (opts) => {
  return scheduler.init(taskId, opts)
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
  scheduleAutorun,
  disableAutorun
}
