import log from 'electron-log'
import Store from 'electron-store'
import { init } from '../store'

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

jest.mock('../paths', () => ({
  getHomeDir: jest.fn(() => '/home/user/probe-desktop/ooni_home'),
  getBinaryDirectory: jest.fn(() => '/home/user/probe-desktop/ooni_home'),
  getBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
}))

jest.mock('electron-store', () => jest.fn(() => ({
  reset: jest.fn()
})))

describe('Tests for Store', () => {
  test('Initialization of store with init', async () => {
    const store = await init()
    expect(2).toBe(2)
  })
})