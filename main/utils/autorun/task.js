const log = require('electron-log')
const { getBinaryPath } = require('../paths')
const winScheduler = require('./windows-scheduler')
const macScheduler = require('./mac-scheduler')
const taskId = 'org.ooni.probe-desktop' // Maybe use GUID
const pathToProbeCLI = getBinaryPath()
const cmdToRun = `${pathToProbeCLI} run unattended`

const platforms = {
  win32: winScheduler,
  darwin: macScheduler
}

const scheduler = platforms[process.platform]

// These task managment methods should be made platform-agnostic
// by either using prototypes or some similar pattern
const create = () => {
  scheduler.get(taskId).then(() => {
    log.debug('Task found.')
    scheduler.delete(taskId).then(() => {
      log.debug('Task deleted.')
    }).catch(e => {
      throw Error(`Task not deleted: ${e.message}`)
    })
  }).catch(() => {
    log.debug('Task not found. Might not have been scheduled before.')
  }).finally(() => {
    macScheduler.create(taskId, cmdToRun).then(() => {
      log.debug('Task created')
    }).catch((e) => {
      throw Error(`Task creation failed: ${e}`)
    })
  })
}

// TODO
// checkIfAlreadyScheduled
// disable()
// UnSchedule() ?

module.exports = {
  create
}
