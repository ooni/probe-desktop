import {
  hardReset,
  listMeasurements,
  listResults,
  showMeasurement,
} from '../actions'
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

jest.mock('../utils/paths', () => ({
  getHomeDir: jest.fn(() => '/home/user/probe-desktop/ooni_home'),
  getAutorunHomeDir: jest.fn(() => '/home/user/probe-desktop/ooni_home_autorun'),
  getProbeBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
  getTorBinaryPath: jest.fn(() => 'build/tor/linux_amd64'),
}))

const currentVersion = process.env.npm_package_version

describe('Hard reset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Hard resetting spawns a child_process with expected args', async () => {
    const cmdArgs = [
      '--batch',
      '--software-name=ooniprobe-desktop',
      `--software-version=${currentVersion}`,
      'reset',
      '--force',
    ]
    hardReset()
    expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
  })
})

describe('List measurements', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Listing measurements spawns a child_process with expected args', async () => {
    const cmdArgs = [
      '--batch',
      '--software-name=ooniprobe-desktop',
      `--software-version=${currentVersion}`,
      'list',
      '11',
    ]
    listMeasurements('11')

    expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
  })
})

describe('List Results', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('listResults spawns a child_process with expected args', async () => {
    const cmdArgs = [
      '--batch',
      '--software-name=ooniprobe-desktop',
      `--software-version=${currentVersion}`,
      'list',
    ]
    listResults('list')

    expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
  })
})

describe('Show measurements', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('showMeasurements spawns a child_process with expected args', async () => {
    const cmdArgs = [
      '--batch',
      '--software-name=ooniprobe-desktop',
      `--software-version=${currentVersion}`,
      'show',
      'FKS 43',
    ]
    showMeasurement('FKS 43')

    expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
  })
})
