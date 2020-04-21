/* global windows, require, module */
const { Ooniprobe } = require('./ooniprobe')
const log = require('electron-log')

class Runner {
  constructor({testGroupName}) {
    this.testGroupName = testGroupName
    this.ooni = new Ooniprobe()
  }

  kill() {
    log.info('Runner: terminating the ooniprobe process')
    return this.ooni.kill()
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
    log.info('Runner: calling run', testGroupName)
    return this.ooni.call(['run', testGroupName])
  }
}

module.exports = {
  Runner: Runner
}
