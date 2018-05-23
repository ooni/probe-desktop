const { EventEmitter } = require('events')
const childProcess = require('child_process')

const split2 = require('split2')

const Sentry = require('@sentry/electron')

const { getBinaryPath, getSSLCertFilePath, getHomeDir } = require('../paths')

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
          "OONI_HOME": getHomeDir(),
          "SSL_CERT_FILE": getSSLCertFilePath()
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

      ooni.stderr.pipe(split2()).on('data', line => {
        debug('stderr: ', line.toString())
        try {
          const msg = JSON.parse(line.toString('utf8'))
          self.emit('data', msg)
        } catch (err) {
          debug('failed to call JSON.parse', line.toString('utf8'), err)
          Sentry.addBreadcrumb({
            message: 'got unparseable line from ooni cli',
            category: 'internal',
            data: {
               line: line.toString('utf8')
            }
          })
        }
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
