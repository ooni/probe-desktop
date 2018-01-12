const { EventEmitter } = require('events')
const childProcess = require('child_process')

class Ooniprobe extends EventEmitter {
  constructor({binaryPath}) {
    super()
    this._binaryPath = binaryPath
  }

  run({testGroupName, argv}) {
    const self = this
    return new Promise((resolve, reject) => {
      self.emit('starting', testGroupName)
      const options = {
        stdio: ['ignore', 'ignore', 'ignore', 'ipc']
      }
      const argv = ['--ipc', 'run', testGroupName]
      console.log('running', self._binaryPath, argv, options)
      const ooni = childProcess.spawn(self._binaryPath, argv, options)

      ooni.on('message', msg => {
        console.log('got message', msg);
        self.emit('message', msg)
      })

      ooni.on('exit', code => {
        if (code === 0) {
          resolve()
          return
        }
        reject(new Error('failed with code ' + code))
      })
    })
  }
}

module.exports = {
  Ooniprobe: Ooniprobe
}
