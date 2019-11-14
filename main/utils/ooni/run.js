/* global windows, require, module */
const { Ooniprobe } = require('./ooniprobe')

class Runner {
  constructor({testGroupName}) {
    this.testGroupName = testGroupName
    this.ooni = new Ooniprobe()
  }

  kill() {
    return this.ooni.kill()
  }

  run() {
    const testGroupName = this.testGroupName
    windows.main.send('starting', testGroupName)
    this.ooni.on('data', (data) => {
      if (data.level == 'error') {
        windows.main.send('ooni', {
          key: 'error',
          message: data.message
        })
        return
      }

      switch(data.fields.type) {
      case 'progress':
        windows.main.send('ooni', {
          key: 'ooni.run.progress',
          percentage: data.fields.percentage,
          eta: data.fields.eta,
          message: data.message,
          testKey: data.fields.key,
        })
        break
      default:
        windows.main.send('ooni', {
          key: 'log',
          value: data.message
        })
      }
    })
    return this.ooni.call(['run', testGroupName])
  }
}

module.exports = {
  Runner: Runner
}
