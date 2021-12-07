const { app } = require('electron')
const { writeFile, unlink } = require('fs').promises
const { existsSync, writeFileSync } = require('fs-extra')
const { spawnSync } = require('child_process')
const { join } = require('path')
const os = require('os')
const log = require('electron-log')

const { getAutorunHomeDir, getProbeBinaryPath, getTorBinaryPath } = require('../paths')

const domainTarget = `gui/${os.userInfo().uid}`
const getServiceTarget = appId => `${domainTarget}/${appId}`

const getTaskPlistPath = (taskname) => {
  return join(
    app.getPath('home'), 'Library', 'LaunchAgents',
    `${taskname}.plist`
  )
}

const launchctl = (command, args) => {
  const cmd = spawnSync('launchctl', [command, ...args])
  const error = cmd.stderr.toString().trim()
  if (error) {
    log.debug(`failure in launchctl ${command}: exit ${cmd.status}: ${error}`)
    throw {message: error, exit: cmd.status}
  }
  const output = cmd.stdout.toString().trim()
  log.debug(`Output of 'launchctl ${command}': ${output}`)
  return cmd
}

module.exports = {
  init: function (taskId, /* opts */) {
    // Check if required files are on disk
    // (Re)generate files that are missing or removed by an update
    return new Promise((resolve, reject) => {
      const taskPlistPath = getTaskPlistPath(taskId)
      if (!existsSync(taskPlistPath)) {
        log.verbose(`Autorun plist file missing at ${taskPlistPath}`)
        try {
          const plistTemplate = require('./taskTemplateMac')
          const taskPlistStr = plistTemplate({
            taskName: taskId,
            pathToProbeBinary: getProbeBinaryPath(),
            pathToTorBinary: getTorBinaryPath(),
            OONI_HOME_autorun: getAutorunHomeDir()
          })
          writeFileSync(taskPlistPath, taskPlistStr)
          log.verbose(`Autorun plist file created at ${taskPlistPath}`)
        } catch (e) {
          log.error(`Failed to create autorun task plist file: ${taskPlistPath}: ${e.message}`)
        }
      }
      resolve()
    })
  },
  get: function (taskname) {
    return new Promise((resolve, reject) => {
      try {
        const cmd = launchctl('list', [taskname])
        switch(cmd.status) {
        case 0:
          return resolve()
        case 113:
          return reject('launchctl list exited with 113')
        default:
          return reject(`Unknown error with exit code ${cmd.status}`)
        }
      } catch(e) {
        reject(`Failed to find ${taskname} in launchd: ${e.message}`)
      }
      log.verbose(`$ launchctl list ${taskname}`)

    })
  },
  create: function (taskname) {
    return new Promise((resolve, reject) => {
      const plistTemplate = require('./taskTemplateMac')
      const taskPlistStr = plistTemplate({
        taskName: taskname,
        pathToProbeBinary: getProbeBinaryPath(),
        pathToTorBinary: getTorBinaryPath(),
        OONI_HOME_autorun: getAutorunHomeDir()
      })
      const taskPlistPath = getTaskPlistPath(taskname)
      writeFile(taskPlistPath, taskPlistStr).then(() => {
        log.debug(`Enable task with: launchctl enable / bootstrap ${taskPlistPath}`)
        try {
          launchctl('enable', [getServiceTarget(taskname)])
          launchctl('bootstrap', [domainTarget, taskPlistPath])
          resolve()
        } catch (e) {
          reject(`Failed to enable task in launchd: ${e.message}`)
        }
      }).catch(e => {
        reject(`Failed to create plist file: ${e.message}`)
      })
    })
  },

  // To delete a task from scheduler:
  // 1. run `launchctl bootout <service-target>
  // Note that the above command may throw an acceptable error
  // "Operation now in progress" if the task is already running but it usually
  // terminates the process successfully right after it exits with code 36
  // 2. remove the plist file in ~/Library/LaunchAgents/
  delete: function (taskname) {
    const taskPlistPath = getTaskPlistPath(taskname)
    return new Promise((resolve) => {
      try {
        launchctl('bootout', [getServiceTarget(taskname), '2>&1'])
      } catch (e) {
        if(e.exit !== 0 || e.exit !== 36) {
          log.error(`launchctl bootout failed unexpectedly: ${e.message}`)
        }
      }
      unlink(taskPlistPath).then(() => {
        log.debug('Deleted plist file after unloading task')
      }).catch(e => {
        log.error(`Failed to delete plist file after unloading task: ${e.message}`)
      })
      log.info('Disabled autorun task.')
      resolve()
    })
  }
}
