/* global windows, require, module */
const { Ooniprobe } = require('./ooniprobe')
const log = require('electron-log')
const { getConfig } = require('../config')

class Runner {
  constructor({testGroupName}) {
    this.testGroupName = testGroupName
    this.ooni = new Ooniprobe()
    this.maxRuntimeTimer = null
    this.etaReportInterval = null
  }

  kill() {
    if (this.maxRuntimeTimer) {
      clearTimeout(this.maxRuntimeTimer)
    }
    log.info('Runner: terminating the ooniprobe process')
    return this.ooni.kill()
  }

  getTimeLeftInTimer() {
    if (this.maxRuntimeTimer) {
      const { _idleStart, _idleTimeout} = this.maxRuntimeTimer
      const timerETA = Math.ceil(
        (_idleStart + _idleTimeout) / 1000
        - process.uptime()
      )
      return timerETA
    } else {
      return -1
    }
  }

  async maybeStartMaxRuntimeTimer () {
    const config = await getConfig()
    if (
      this.testGroupName === 'websites' &&
      config['nettests']['websites_enable_max_runtime'] === true
    ) {
      const maxRunTime = Number(config['nettests']['websites_max_runtime']) * 1000
      log.info(`Max runtime enabled. Will stop test in ${Math.ceil(maxRunTime / 1000)} seconds`)

      this.maxRuntimeTimer = setTimeout(() => {
        log.info('Runner: reached maximum time allowed to run test.')
        clearInterval(this.etaReportInterval)
        this.ooni.kill()
      }, maxRunTime)

      this.etaReportInterval = setInterval((maxRunTime) => {
        const timeLeftInTimer = this.getTimeLeftInTimer()
        const percentCompleted = (maxRunTime - timeLeftInTimer * 1000) / maxRunTime
        windows.main.send('ooni', {
          key: 'ooni.run.progress',
          percentage: percentCompleted,
          eta: timeLeftInTimer
        })
      }, 1000, maxRunTime)
    }
  }

  run() {
    const testGroupName = this.testGroupName
    windows.main.send('starting', testGroupName)
    this.ooni.on('data', (data) => {
      if (data.level == 'error') {
        log.error('Runner: error', data.message)
        windows.main.send('ooni', {
          key: 'error',
          message: data.message
        })
        return
      }

      let logMessage = data.message
      if (data.fields.type == 'progress') {
        windows.main.send('ooni', {
          key: 'ooni.run.progress',
          percentage: data.fields.percentage,
          eta: data.fields.eta,
          message: data.message,
          testKey: data.fields.key,
        })
        logMessage = `${data.fields.percentage}% - ${data.message}`
      }
      windows.main.send('ooni', {
        key: 'log',
        value: logMessage
      })
    })

    this.maybeStartMaxRuntimeTimer()

    log.info('Runner: calling run', testGroupName)
    return this.ooni.call(['run', testGroupName])
  }
}

module.exports = {
  Runner: Runner
}
