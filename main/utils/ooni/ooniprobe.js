const { EventEmitter } = require('events')
const childProcess = require('child_process')
const { getBinaryPath } = require('../paths')

const debug = require('debug')('ooniprobe-desktop.utils.ooni.ooniprobe')

class Ooniprobe extends EventEmitter {
  constructor(props) {
    super()
    this._binaryPath = (props && props.binaryPath) || getBinaryPath()
  }

  run({testGroupName, argv}) {
    const self = this
    return new Promise((resolve, reject) => {
      const options = {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          "SSL_CERT_FILE": ""
        }
      }
      const argv = ['--batch', 'run', testGroupName]

      debug('running', self._binaryPath, argv, options)

      let ooni
      try {
        ooni = childProcess.spawn(self._binaryPath, argv, options)
      } catch (err) {
        reject(err)
      }

      ooni.on('error', function(err) {
        debug('cp.spawn.error:', err)
        reject(err)
      });

      ooni.stdout.on('data', data => {
        debug('stdout: ', data.toString())
      })

      ooni.stderr.on('data', data => {
        debug('stderr: ', data.toString())
        const msg = JSON.parse(data.toString())
        self.emit('data', msg)
      })

      ooni.on('exit', code => {
        debug('exited with code', code)
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
