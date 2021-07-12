import { Ooniprobe } from '../ooniprobe'
import childProcess from 'child_process'
import log from 'electron-log'
import { waitFor } from '@testing-library/react'

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
    expect(ooniInstance._binaryPath).toMatch(/amd64/i)
    expect(ooniInstance.ooni).toBeNull()

    // Checking if the kill and call functions are
    // defined in the initialized Ooniprobe instance
    expect(ooniInstance.kill).toBeTruthy()
    expect(ooniInstance.call).toBeTruthy()
  })
})

describe('Tests if killing Ooniprobe instances work as expected', () => {
  test('Killing Ooniprobe instance with truthy .ooni property calls stdin.end function', async () => {
    const ooniInstance = new Ooniprobe()
    ooniInstance.ooni = {
      stdin: {
        end: jest.fn(),
      },
    }
    ooniInstance.kill()
    expect(ooniInstance.ooni.stdin.end).toHaveBeenCalledTimes(1)
  })

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
      '--software-name=ooniprobe-desktop',
      // '--software-version=3.5.2', // For CI
      '--software-version=3.6.0-dev', // For dev environment
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
})

describe('Testing behaviour of "on" IPC events on using .call() with an Ooniprobe instance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Promise rejects with correct error message on "error" event', async () => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {
        if (event === 'error') {
          // Simulating the callback with an error message
          callback('There was an error')
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
    await waitFor(() =>
      expect(ooniInstance.call(['list'])).rejects.toBe('There was an error')
    )
  })

  test('Promise resolves with correct exit code 0 on "exit" event', async () => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {
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

  test('Promise is reject with correct exit code 1 on "exit" event', async () => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {
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
    const mockErrorMessage = 10870098
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn(),
      stderr: {
        on: jest.fn((event, callback) => {
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
    const mockJsonMessage = '[{ "msg": "There was an error in the measurement" }]'
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
              callback(mockJsonMessage)
            }
          }),
        })),
      },
    }))
    const ooniInstance = new Ooniprobe()
    ooniInstance.emit = jest.fn()
    ooniInstance.call(['list'])
    expect(ooniInstance.emit).toHaveBeenCalledTimes(1)
    expect(ooniInstance.emit.mock.calls[0][0]).toBe('data')
    expect(ooniInstance.emit.mock.calls[0][1]).toEqual(JSON.parse(mockJsonMessage))
  })
})
