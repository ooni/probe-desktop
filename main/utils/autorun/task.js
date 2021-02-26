const { join } = require('path')
const log = require('electron-log')
const { app } = require('electron')
const { getBinaryPath, getAutorunHomeDir } = require('../paths')
const windowsScheduler = require('../../vendor/windows-scheduler')

const taskId = 'org.ooni.probe-desktop' // Maybe use GUID
const pathToProbeCLI = getBinaryPath()
const cmdToRun = `${pathToProbeCLI} run all`

// These task managment methods should be made platform-agnostic
// by either using prototypes or some similar pattern
const create = () => {
  windowsScheduler.get(taskId).then(() => {
    log.debug('Task found.')
    windowsScheduler.delete(taskId).then(() => {
      log.debug('Task deleted.')
    }).catch(e => {
      log.debug(`Task not deleted: ${e.message}`)
    })
  }).catch(() => {
    log.debug('Task not found.')
  }).finally(() => {
    const { writeFile, unlink } = require('fs').promises
    const windowsTemplate = require('./taskWindowsTemplate')
    const taskXmlStr = windowsTemplate({
      taskName: taskId,
      taskCmd: cmdToRun,
      OONI_HOME_autorun: getAutorunHomeDir()
    })
    const taskXmlFile = join(app.getPath('temp'), 'ooniprobe-autorun-task.xml')
    try {
      writeFile(taskXmlFile, taskXmlStr).then(() => {
        log.debug(`Autorun task XML file created: ${taskXmlFile}`)
        windowsScheduler.createXML(taskId, cmdToRun, taskXmlFile).then(() => {
          log.debug('Task created')
        }).catch((e) => {
          log.debug(`Task creation failed: ${e}`)
        }).finally(() => {
          unlink(taskXmlFile)
          log.debug('Autorun task XML file deleted')
        })
      })
    } catch (e) {
      log.debug(`Failed to create autorun task XML file: ${e.message}`)
    }
  })
}

// TODO
// checkIfAlreadyScheduled
// disable()
// UnSchedule() ?

module.exports = {
  create
}
