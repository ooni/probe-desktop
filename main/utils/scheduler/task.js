const log = require('electron-log')
const { getBinaryPath } = require('../paths')
const win32Scheduler = require('../../vendor/windows-scheduler')
const windowsScheduler = require('../../vendor/windows-scheduler')

const pad2 = (n) => ('00'+n).slice(-2)
const taskId = 'org.ooni.probe-desktop' // Maybe use GUID
const pathToProbeCLI = getBinaryPath()
const cmdToRun = `"${pathToProbeCLI} run all"`

// These task managment methods should be made platform-agnostic
// by either using prototypes or some similar pattern
const create = () => {
  const now = new Date()
  const tplus1minute = `${pad2(now.getHours())}:${pad2(now.getMinutes() + 1)}`
  windowsScheduler.get(taskId).then(() => {
    log.debug('Task found.')
    win32Scheduler.delete(taskId).then(() => {
      log.debug('Task deleted.')
    }).catch(e => {
      log.debug(`Task not deleted: ${e.message}`)
    })
  }).catch(() => {
    log.debug('Task not found.')
  }).finally(() => {
    win32Scheduler.create(taskId, cmdToRun, {
      frequency: 'DAILY',
      starttime: tplus1minute
    }).then(() => {
      log.debug('Task created')
    }).catch((e) => {
      log.debug(`Task creation failed: ${e.message}`)
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
