import { hardReset, listMeasurements, listResults, showMeasurement } from '../../../actions'
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

describe('Hard reset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Hard resetting spawns a child_process with expected args', async () => {
    const cmdArgs = [
      '--batch',
      '--software-name=ooniprobe-desktop',
      '--software-version=3.5.2',
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
      '--software-version=3.5.2',
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
      '--software-version=3.5.2',
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
      '--software-version=3.5.2',
      'show',
      'FKS 43',
    ]
    showMeasurement('FKS 43')

    expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
  })
})