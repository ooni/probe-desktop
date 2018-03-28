const { EventEmitter } = require('events')
const childProcess = require('child_process')
const { getBinaryPath } = require('../binary')

class Ooniprobe extends EventEmitter {
  constructor(props) {
    super()
    this._binaryPath = (props && props.binaryPath) || getBinaryPath()
  }

  run({testGroupName, argv}) {
    const self = this
    return new Promise((resolve, reject) => {
      self.emit('starting', testGroupName)
      const options = {
        stdio: ['pipe', 'pipe', 'pipe']
      }
      const argv = ['--batch', 'run', testGroupName]
      console.log('running', self._binaryPath, argv, options)
      const ooni = childProcess.spawn(self._binaryPath, argv, options)

      ooni.stderr.on('data', data => {
        const msg = JSON.parse(data.toString())
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
