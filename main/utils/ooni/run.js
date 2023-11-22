/* global windows */
const { Ooniprobe } = require('./ooniprobe')
const log = require('electron-log')

class Runner {
  constructor({testGroupName, inputFile = null}) {
    this.testGroupName = testGroupName
    this.inputFile = inputFile
    this.ooni = new Ooniprobe()
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
          percentage: data.fields.percentage,
          eta: data.fields.eta
        }
        windows.main.send('ooni', updatePacket)

        logMessage = `${data.fields.percentage}% - ${data.message}`
      }
      windows.main.send('ooni', {
        key: 'log',
        value: logMessage
      })
    })

    // When ooniprobe exits, perform any cleanup needed
    // this.ooni.on('exit', (/* code */) => {
    // })

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
