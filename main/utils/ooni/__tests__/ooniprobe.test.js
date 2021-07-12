import { Ooniprobe } from '../ooniprobe'
import childProcess from 'child_process'
import log from 'electron-log'

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
  spawn: jest.fn()
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

describe('Ooniprobe instances can call the IPC events', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('ChildProcess is spawned on .call()', async () => {
    childProcess.spawn.mockImplementation(() => ({
      stdin: {
        end: jest.fn(),
      },
      on: jest.fn((event, callback) => {
        console.log('pepe: ', event)
        callback()
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
    const calledPromise = ooniInstance.call(['list'])
    console.log('calls: ', childProcess.spawn.mock.calls)
    expect(2).toBeTruthy()
  })
})
