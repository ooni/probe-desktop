const { app } = require('electron')
const { writeFile, unlink } = require('fs').promises
const { spawnSync } = require('child_process')
const { join } = require('path')
const log = require('electron-log')

const { getBinaryPath, getAutorunHomeDir } = require('../paths')

const pathToProbeCLI = getBinaryPath()

const getTaskPlistPath = (taskname) => {
  return join(
    app.getPath('home'), 'Library', 'LaunchAgents',
    `${taskname}.plist`
  )
}


function launchctl(command, args) {
  return spawnSync('launchctl', [command, ...args])
}

module.exports = {
  get: function (taskname) {
    return new Promise((resolve, reject) => {
      const cmd = launchctl('list', [taskname])
      const error = cmd.stderr.toString().trim()
      const output = cmd.stdout.toString().trim()
      log.verbose(`$ launchctl list ${taskname}`)

      switch(cmd.status) {
      case 0:
        log.verbose(output)
        return resolve()
      case 113:
        log.verbose(error)
        return reject(error)
      default:
        log.verbose(error)
        return reject(`Unknown eror: ${error}`)
      }
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
        log.debug(`Autorun task plist file created: ${taskPlistPath}`)
        log.debug(`Enable task with: launchctl load ${taskPlistPath}`)
        const cmd = launchctl('load', [taskPlistPath])
        const error = cmd.stderr.toString().trim()
        if (error) {
          log.debug(`failure in launchctl: ${error}`)
          return reject(error)
        }
        log.debug(`Enable command result: ${cmd.stdout.toString().trim()}`)
        resolve()
      }).catch(e => {
        reject(`Failed to create plist file: ${e.message}`)
      })
    })
  },
  delete: function (taskname) {
    const taskPlistPath = getTaskPlistPath(taskname)
    return new Promise((resolve, reject) => {
      const cmd = launchctl('unload', [taskPlistPath])
      const error = cmd.stderr.toString().trim()
      if (error) {
        log.debug(`failure in launchctl unload: ${error}`)
        return reject(error)
      }
      log.debug(`Autorun disable command result: ${cmd.stdout.toString().trim()}`)
      unlink(taskPlistPath).then(() => {
        log.debug('Deleted plist file after unloading task')
      }).catch(e => {
        reject(`Failed to delete plist file after unloading task: ${e.message}`)
      })
      log.info('Disabled autorun task.')
      resolve()
    })
  }
}
