import { Runner } from '../run'
import childProcess from 'child_process'
import log from 'electron-log'
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
  spawn: jest.fn(() => ({
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
  })),
}))

jest.mock('../../paths', () => ({
  getHomeDir: jest.fn(() => '/home/user/probe-desktop/ooni_home'),
  getBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
}))

const currentVersion = process.env.npm_package_version

// eslint-disable-next-line
window.windows = {
  main: {
    send: jest.fn(),
  },
}

describe('Tests for Runner class', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('.run() spawns a child_process with expected args', async () => {
    const cmdArgs = [
      '--batch',
      '--software-name=ooniprobe-desktop',
      `--software-version=${currentVersion}`,
      'run',
      'im',
    ]
    const runnerInstance = new Runner({ testGroupName: 'im' })
    runnerInstance.run()

    expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
  })
})
