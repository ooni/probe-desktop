/* global require, module */
const { EventEmitter } = require('events')
const childProcess = require('child_process')
const os = require('os')
const path = require('path')

const { is } = require('electron-util')

const split2 = require('split2')

const Sentry = require('@sentry/electron')

const { getBinaryPath, getSSLCertFilePath, getHomeDir } = require('../paths')

const debug = require('debug')('ooniprobe-desktop.utils.ooni.ooniprobe')

const GetHomeShortPath = () => {
  // This is taken from: https://github.com/sindresorhus/untildify/pull/13/files
  const homeDir = os.homedir()
  const tmpDir = os.tmpdir()
  // userDir become something like C:\\Users\\, but C and Users can change
  // depending on the language of the OS.
  const userDir = homeDir.replace(/([^\\])+$/g, '')
  if (!tmpDir.startsWith(userDir)) {
    throw Error('cannot fixup the shortpath')
  }
  const user83 = tmpDir.slice(userDir.length).replace(/\\.*$/, '')
  return path.join(userDir, user83)
}

class Ooniprobe extends EventEmitter {
  constructor(props) {
    super()
    this._binaryPath = (props && props.binaryPath) || getBinaryPath()
  }

  call(argv) {
    const self = this
    return new Promise((resolve, reject) => {
      let ooni
      try {
        let binPath = self._binaryPath,
          options = {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
              'OONI_HOME': getHomeDir(),
              'SSL_CERT_FILE': getSSLCertFilePath()
            }
          }
        if (is.windows) {
          const isAscii = /^[ -~]+$/
          let homeDir = os.homedir()
          try {
            // This is a workaround for the users home directory containing
            // non-ascii characters.
            // For more context see: https://github.com/nodejs/node/issues/17586
            if (!isAscii.test(homeDir)) {
              // eslint-disable-next-line no-console
              console.log('detected non-ascii characters in homeDir', homeDir)
              const shortHomeDir = GetHomeShortPath()
              options.env['OONI_HOME'] = path.join(shortHomeDir, path.relative(homeDir, options.env.OONI_HOME))
              options.env['SSL_CERT_FILE'] = path.join(shortHomeDir, path.relative(homeDir, options.env.SSL_CERT_FILE))
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log('failed to determine the home shortpath. Things will break with user homes which contain non-ascii characters.')
          }
        }
        argv = ['--batch'].concat(argv)

        debug('running', binPath, argv, options)
        ooni = childProcess.spawn(binPath, argv, options)
      } catch (err) {
        reject(err)
        return
      }

      ooni.on('error', function(err) {
        debug('cp.spawn.error:', err)
        reject(err)
      })

      ooni.stdout.on('data', data => {
        debug('stderr: ', data.toString())
      })

      ooni.stderr.pipe(split2()).on('data', line => {
        debug('stdout: ', line.toString())
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
