// TODO: Mocking a general useRouter().push() case

import { Ooniprobe } from '../ooniprobe'
import childProcess from 'child_process'
import log from 'electron-log'
import pkgJson from '../../../../package.json'
import Sentry from '@sentry/electron'

jest.mock('electron-util', () => ({
  is: {
    development: true,
    macos: false,
    linux: true,
    windows: false,
  },
}))

log.debug = jest.fn()
log.info = jest.fn()
log.verbose = jest.fn()
log.error = jest.fn()

Sentry.addBreadcrumb = jest.fn()

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}))

jest.mock('../../paths', () => ({
  getHomeDir: jest.fn(() => '/home/user/probe-desktop/ooni_home'),
  getBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
}))

describe('Test the initialization of Ooniprobe instances', () => {
  test('Ooniprobe instances are initialized in an expected way', async () => {
    const ooniInstance = new Ooniprobe()
    expect(ooniInstance._binaryPath).toBeTruthy()
    expect(ooniInstance._binaryPath).toMatch(/linux_amd64/i)
    expect(ooniInstance.ooni).toBeNull()

    // Checking if the kill and call functions are
    // defined in the initialized Ooniprobe instance
    expect(typeof ooniInstance.kill).toBe('function')
    expect(typeof ooniInstance.call).toBe('function')
  })
})

describe('Killing Ooniprobe instance before calling .call() throws error', () => {
  test('Killing Ooniprobe instance if .ooni is null throws error', async () => {
    const ooniInstance = new Ooniprobe()
    const errorMessage = 'cannot kill an unstarted process'
    const errorFunc = () => {
      try {
        ooniInstance.kill()
      } catch (err) {
        throw Error(err)
      }
    }
    expect(errorFunc).toThrow(errorMessage)
  })
})

describe('Ooniprobe instances invokes .call() method', () => {
  beforeAll(() => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn(),
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn(),
        })),
      },
    }))
  })

  test('ChildProcess is spawned on .call()', async () => {
    const binaryPath = 'build/probe-cli/linux_amd64'
    const args = [
      '--batch',
      `--software-name=${pkgJson.name}`,
      `--software-version=${pkgJson.version}`,
      'list',
    ]
    const options = {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        OONI_HOME: '/home/user/probe-desktop/ooni_home',
        OONI_STDIN_EOF_IMPLIES_SIGTERM: 'true',
      },
    }
    const ooniInstance = new Ooniprobe()
    ooniInstance.call(['list'])
    expect(childProcess.spawn).toHaveBeenCalledTimes(1)
    expect(childProcess.spawn.mock.calls[0][0]).toBe(binaryPath)
    expect(childProcess.spawn.mock.calls[0][1].toString()).toMatch(
      args.toString()
    )
    expect(childProcess.spawn.mock.calls[0][2]).toMatchObject(options)
  })

  test('Killing Ooniprobe instance with truthy .ooni property calls stdin.end function', async () => {
    const ooniInstance = new Ooniprobe()

    ooniInstance.call(['list'])

    ooniInstance.kill()
    expect(ooniInstance.ooni.stdin.end).toHaveBeenCalledTimes(1)
  })
})

describe('Testing behaviour of "on" IPC events on using .call() with an Ooniprobe instance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Promise rejects with correct error message on "error" event', async () => {
    const errorMessage = 'There was an error'

    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {

        // Simulating probe-cli emitting 'error' event with an error message
        if (event === 'error') {
          callback(errorMessage)
        } else {
          return
        }
      }),
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn(),
        })),
      },
    }))
    const ooniInstance = new Ooniprobe()

    await expect(ooniInstance.call(['list'])).rejects.toBe(errorMessage)
  })

  test('Promise resolves with correct exit code 0 on "exit" event', async () => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {
        // Simulating probe-cli emitting 'exit' event with code 0
        if (event === 'exit') {
          callback(0)
        }
      }),
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn(),
        })),
      },
    }))
    const ooniInstance = new Ooniprobe()
    await expect(ooniInstance.call(['list'])).resolves.toBeUndefined()
  })

  test('Promise resolves with correct exit code null on "exit" event', async () => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {
        // Simulating probe-cli emitting 'exit' event with code null
        if (event === 'exit') {
          callback(null)
        }
      }),
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn(),
        })),
      },
    }))
    const ooniInstance = new Ooniprobe()
    await expect(ooniInstance.call(['list'])).resolves.toBeUndefined()
  })

  test('Promise is rejected on exit code 1 in "exit" event', async () => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {
        // Simulating probe-cli emitting 'exit' event with code 1
        if (event === 'exit') {
          callback(1)
        }
      }),
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn(),
        })),
      },
    }))
    const ooniInstance = new Ooniprobe()
    const argv = ['list']
    const binaryPath = 'build/probe-cli/linux_amd64'
    const errorMessage = new Error(
      `Running '${binaryPath} ${argv.join(' ')}' failed with exit code: 1`
    )
    await expect(ooniInstance.call(argv)).rejects.toThrow(errorMessage)
  })
})

describe('Testing the behavior of remaining IPC events', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })

  test('Logs error on stderr "data" event', async () => {

    // Assigning a numerical value to make sure 
    // that it is converted to string
    const mockErrorMessage = 10870098

    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn(),
      stderr: {
        on: jest.fn((event, callback) => {
          // Simulating probe-cli emitting 'stderr' event on 'data'
          if (event === 'data') {
            callback(mockErrorMessage)
          }
        }),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn(),
        })),
      },
    }))
    const ooniInstance = new Ooniprobe()
    ooniInstance.call(['list'])

    expect(log.error.mock.calls[0][0]).toBe('stderr: ')
    expect(log.error.mock.calls[0][1]).toBe(mockErrorMessage.toString())
  })

  test('Emits message on stdout "data" event', async () => {
    const line = `{
      "fields": {
        "total_data_usage_down": 729963.47265625,
        "total_data_usage_up": 41480.248046875,
        "total_networks": 1,
        "total_tests": 13,
        "type": "result_summary"
      },
      "level": "info",
      "timestamp": "2021-08-10T16:43:23.463179849+05:30",
      "message": "result summary"
    }`

    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn(),
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn((event, callback) => {
            // Simulating probe-cli emitting 'stdout' event on 'data'
            if (event === 'data') {
              callback(line)
            }
          }),
        })),
      },
    }))
    const ooniInstance = new Ooniprobe()

    // Mocking ooniInstance.emit and replacing it with jest.fn()
    ooniInstance.emit = jest.fn()

    ooniInstance.call(['list'])
    
    expect(ooniInstance.emit).toHaveBeenCalledTimes(1)
    expect(ooniInstance.emit.mock.calls[0][0]).toBe('data')
    expect(ooniInstance.emit.mock.calls[0][1]).toEqual(JSON.parse(line))
  })

  test('Throws error on stdout "data" event if JSON.parse fails', async () => {

    // nonJSONLine throws error on trying to parse it to JSON
    const nonJSONLine = `{
      "fields": {
        "total_data_usage_down": 729963.47265625,
        "total_data_usage_up": 41480.248046875,
        "total_networks": 1,
        "total_tests": 13,
        "type": "result_summary
      }
    }`

    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn(),
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        pipe: jest.fn(() => ({
          on: jest.fn((event, callback) => {
            if (event === 'data') {
              callback(nonJSONLine)
            }
          }),
        })),
      },
    }))

    const ooniInstance = new Ooniprobe()
    ooniInstance.call(['list'])

    // Calls Sentry.addBreadcrumb with expected arg object if parsing JSON throws error
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      message: 'got unparseable line from ooni cli',
      category: 'internal',
      data: {
        line: nonJSONLine.toString('utf8')
      }
    })
  })
})
