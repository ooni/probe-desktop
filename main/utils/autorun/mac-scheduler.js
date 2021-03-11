const { app } = require('electron')
const { writeFile, unlink } = require('fs').promises
const { spawnSync } = require('child_process')
const { join } = require('path')
const os = require('os')
const log = require('electron-log')

const { getBinaryPath, getAutorunHomeDir } = require('../paths')

const pathToProbeCLI = getBinaryPath()

const domainTarget = `gui/${os.userInfo().uid}`
const getServiceTarget = appId => `${domainTarget}/${appId}`

const getTaskPlistPath = (taskname) => {
  return join(
    app.getPath('home'), 'Library', 'LaunchAgents',
    `${taskname}.plist`
  )
}

function launchctl(command, args) {
  const cmd = spawnSync('launchctl', [command, ...args])
  const error = cmd.stderr.toString().trim()
  if (error) {
    log.error(`failure in launchctl ${command}: ${error}`)
    throw error
  }
  const output = cmd.stdout.toString().trim()
  log.debug(`Output of 'launchctl ${command}': ${output}`)
  return cmd
}

module.exports = {
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
        taskCmd: pathToProbeCLI,
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
  delete: function (taskname) {
    const taskPlistPath = getTaskPlistPath(taskname)
    return new Promise((resolve, reject) => {
      try {
        launchctl('bootout', [getServiceTarget(taskname)])
        unlink(taskPlistPath).then(() => {
          log.debug('Deleted plist file after unloading task')
        }).catch(e => {
          return reject(`Failed to delete plist file after unloading task: ${e.message}`)
        })
        log.info('Disabled autorun task.')
        resolve()
      } catch (e) {
        return reject(e)
      }
    })
  }
}
