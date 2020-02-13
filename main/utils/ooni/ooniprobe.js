/* global require, module */
const { EventEmitter } = require('events')
const childProcess = require('child_process')
const os = require('os')
const path = require('path')
const log = require('electron-log')
const { is } = require('electron-util')

const split2 = require('split2')

const Sentry = require('@sentry/electron')

const { getBinaryPath, getHomeDir } = require('../paths')

const GetHomeShortPath = () => {
  // This is taken from: https://github.com/sindresorhus/untildify/pull/13/files
  const homeDir = os.homedir()
  const tmpDir = os.tmpdir()
  // userDir become something like C:\\Users\\, but C and Users can change
  // depending on the language of the OS.
  const userDir = homeDir.replace(/([^\\])+$/g, '')
  if (!tmpDir.startsWith(userDir)) {
    log.error('GetHomeShortPath: cannot fixup', userDir, homeDir)
    throw Error('cannot fixup the shortpath')
  }
  const user83 = tmpDir.slice(userDir.length).replace(/\\.*$/, '')
  return path.join(userDir, user83)
}

class Ooniprobe extends EventEmitter {
  constructor(props) {
    super()
    this._binaryPath = (props && props.binaryPath) || getBinaryPath()
    this.ooni = null
  }

  kill() {
    if (this.ooni === null) {
      throw Error('cannot kill an unstarted process')
    }
    // See https://github.com/ooni/probe-cli/pull/111 for documentation
    // concerning the design of killing ooniprobe portably
    this.ooni.stdin.end()
  }

  call(argv) {
    const self = this
    if (self.ooni !== null) {
      throw Error('can only use call once per instance. Create a new Oooniprobe object!')
    }

    return new Promise((resolve, reject) => {
      try {
        let binPath = self._binaryPath,
          options = {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
              'OONI_HOME': getHomeDir(),
              // See https://github.com/ooni/probe-cli/pull/111 for documentation
              // concerning the design of killing ooniprobe portably
              'OONI_STDIN_EOF_IMPLIES_SIGTERM': 'true'
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
              log.info('detected non-ascii characters in homeDir', homeDir)
              const shortHomeDir = GetHomeShortPath()
              options.env['OONI_HOME'] = path.join(shortHomeDir, path.relative(homeDir, options.env.OONI_HOME))
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.log('failed to determine the home shortpath. Things will break with user homes which contain non-ascii characters.')
          }
        }

        argv = ['--batch'].concat(argv)

        log.info('running', binPath, argv, options)
        self.ooni = childProcess.spawn(binPath, argv, options)
      } catch (err) {
        reject(err)
        return
      }

      self.ooni.on('error', function(err) {
        log.error('cp.spawn.error:', err)
        reject(err)
      })

      self.ooni.stdout.on('data', data => {
        log.error('stderr: ', data.toString())
      })

      self.ooni.stderr.pipe(split2()).on('data', line => {
        log.debug('stdout: ', line.toString())
        try {
          const msg = JSON.parse(line.toString('utf8'))
          self.emit('data', msg)
        } catch (err) {
          log.error('failed to call JSON.parse', line.toString('utf8'), err)
          Sentry.addBreadcrumb({
            message: 'got unparseable line from ooni cli',
            category: 'internal',
            data: {
              line: line.toString('utf8')
            }
          })
        }
      })

      self.ooni.on('exit', code => {
        log.info('exited with code', code)
        // code === null means the process was killed
        if (code === 0 || code === null) {
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
