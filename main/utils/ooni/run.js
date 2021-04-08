/* global windows, require, module */
const { Ooniprobe } = require('./ooniprobe')
const log = require('electron-log')
const { getConfig } = require('../config')

const testGroupsWithMaxRuntime = ['websites', 'all']

class Runner {
  constructor({testGroupName, inputFile = null}) {
    this.testGroupName = testGroupName
    this.inputFile = inputFile
    this.ooni = new Ooniprobe()
    this.maxRuntimeTimer = null
    this.etaReportInterval = null
  }

  kill() {
    try {
      if(process.kill(this.ooni.ooni.pid, 0)) {
        log.info('Runner: terminating the ooniprobe process')
        return this.ooni.kill()
      }
    } catch (e) {
      log.debug(`Failed to find a running ooniprobe process to kill. code: ${e.code}`)
    }

  }

  getTimeLeftInTimer() {
    if (this.maxRuntimeTimer) {
      const { _idleStart, _idleTimeout, _destroyed } = this.maxRuntimeTimer
      if (!_destroyed) {
        const timerETA = Math.ceil(
          (_idleStart + _idleTimeout) / 1000
          - process.uptime()
        )
        return timerETA
      }
    }
    return -1
  }

  async maybeStartMaxRuntimeTimer () {
    const config = await getConfig()
    if (
      testGroupsWithMaxRuntime.includes(this.testGroupName) &&
      config['nettests']['websites_enable_max_runtime'] === true
    ) {
      const maxRunTime = Number(config['nettests']['websites_max_runtime']) * 1000
      log.info(`Max runtime enabled. Will stop test in ${Math.ceil(maxRunTime / 1000)} seconds`)

      this.maxRuntimeTimer = setTimeout(() => {
        log.info('Runner: reached maximum time allowed to run test.')
        this.kill()
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
    const { testGroupName, inputFile } = this

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
        const updatePacket = {
          key: 'ooni.run.progress',
          testKey: data.fields.key,
          message: data.message,
        }
        if (this.maxRuntimeTimer === null) {
          updatePacket['percentage'] = data.fields.percentage
          updatePacket['eta'] = data.fields.eta
        }
        windows.main.send('ooni', updatePacket)

        logMessage = `${data.fields.percentage}% - ${data.message}`
      }
      windows.main.send('ooni', {
        key: 'log',
        value: logMessage
      })
    })

    this.ooni.on('exit', (/* code */) => {
      if (this.maxRuntimeTimer) {
        clearTimeout(this.maxRuntimeTimer)
        clearInterval(this.etaReportInterval)
        this.maxRuntimeTimer = null
        this.etaReportInterval = null
      }
    })

    this.maybeStartMaxRuntimeTimer()

    const runParams = ['run', testGroupName]

    if (testGroupName === 'websites' && inputFile) {
      runParams.push(`--input-file=${inputFile}`)
    }

    log.info(`Runner: calling ${runParams}`)
    return this.ooni.call(runParams)
  }
}

module.exports = {
  Runner: Runner
}
