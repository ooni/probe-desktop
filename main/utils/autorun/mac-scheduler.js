const { app } = require('electron')
const { writeFile, unlink } = require('fs').promises
const { spawnSync } = require('child_process')
const { join } = require('path')
const log = require('electron-log')

const { getBinaryPath, getAutorunHomeDir } = require('../paths')

const pathToProbeCLI = getBinaryPath()

function launchctl(command, args) {
  return spawnSync('launchctl', [command, ...args])
}

module.exports = {
  get: function (taskname, format, verbose) {
    return new Promise((resolve, reject) => {
      reject()
    })
  },
  create: function (taskname, taskrun) {
    return new Promise((resolve, reject) => {
      const plistTemplate = require('./taskTemplateMac')
      const taskPlistStr = plistTemplate({
        taskName: taskname,
        taskCmd: pathToProbeCLI,
        OONI_HOME_autorun: getAutorunHomeDir()
      })
      const taskPlistPath = join(
        app.getPath('home'), 'Library', 'LaunchAgents',
        `${taskname}.plist`
      )
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
    return new Promise((resolve, reject) => {
      // launchctl('unload', [taskPlistPath])
      resolve()
    })
  }
}
