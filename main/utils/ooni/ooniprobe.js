const { EventEmitter } = require('events')
const childProcess = require('child_process')
const os = require('os')
const path = require('path')
const log = require('electron-log/main')
const { is } = require('electron-util')

const split2 = require('split2')

const Sentry = require('@sentry/electron/main')

const { getProbeBinaryPath, getTorBinaryPath, getHomeDir } = require('../paths')
const pkgJson = require('../../../package.json')

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
    this._probeBinaryPath = (props && props.probeBinaryPath) || getProbeBinaryPath()
    this._torBinaryPath = (props && props.torBinaryPath) || getTorBinaryPath()
    this.ooni = null
  }

  kill() {
    if (this.ooni === null) {
      throw Error('cannot kill an unstarted process')
    }
    // See https://github.com/ooni/probe-cli/pull/111 for documentation
    // concerning the design of killing ooniprobe portably
    log.debug('closing this.ooni.stdin')
    this.ooni.stdin.end()
  }

  call(argv, env) {
    const self = this
    if (self.ooni !== null) {
      throw Error('can only use call once per instance. Create a new Oooniprobe object!')
    }

    return new Promise((resolve, reject) => {
      try {
        let probeBinPath = self._probeBinaryPath,
          torBinPath = self._torBinaryPath,
          options = {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
              'OONI_HOME': getHomeDir(),
              // See https://github.com/ooni/probe-cli/pull/111 for documentation
              // concerning the design of killing ooniprobe portably
              'OONI_STDIN_EOF_IMPLIES_SIGTERM': 'true',
              ...env,
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
            log.error('failed to determine the home shortpath. Things will break with user homes which contain non-ascii characters.')
          }
        }
        if (torBinPath !== '') {
          options.env['OONI_TOR_BINARY'] = torBinPath
        } else if (is.linux) {
          // We don't support bundling the tor binary under Linux, so try a best
          // effort strategy and hope that it's installed in the PATH
          options.env['PATH'] = process.env.PATH
        }
        const fixedArgs = [
          '--batch',
          `--software-name=${pkgJson.name}`,
          `--software-version=${pkgJson.version}`
        ]
        const commandArgs = fixedArgs.concat(argv)

        log.info(`running "ooniprobe ${argv.join(' ')}"`)
        log.verbose('running: ', probeBinPath, commandArgs, options)
        self.ooni = childProcess.spawn(probeBinPath, commandArgs, options)
      } catch (err) {
        reject(err)
        return
      }

      self.ooni.on('error', function(err) {
        log.error('cp.spawn.error:', err)
        reject(err)
      })

      self.ooni.stderr.on('data', data => {
        log.error('stderr: ', data.toString())
      })

      self.ooni.stdout.pipe(split2()).on('data', line => {
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
        log.debug(`Running 'ooniprobe ${argv.join(' ')}' exited with code: ${code}`)
        self.emit('exit', code)
        // code === null means the process was killed
        if (code === 0 || code === null) {
          resolve()
          return
        }
        reject(new Error(`Running '${this._probeBinaryPath} ${argv.join(' ')}' failed with exit code: ${code}`))
      })
    })
  }
}

module.exports = {
  Ooniprobe: Ooniprobe
}
