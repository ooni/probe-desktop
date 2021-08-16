import log from 'electron-log'
import Store from 'electron-store'
import { init, get, set, reset } from '../store'
import fs from 'fs-extra'

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
  getBinaryDirectory: jest.fn(() => 'test/mockFiles/bin'),
  getBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
}))

jest.mock('electron-store', () =>
  jest.fn(() => ({
    reset: jest.fn(),
    get: jest.fn((key) => {
      if (key === 'foo') return 'bar'
    }),
    has: jest.fn(() => true),
    set: jest.fn(),
    store_created: true,
  }))
)

describe('Tests for Store', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('init calls Store class, returns a store value and creates .first-run file', async () => {
    // Remove .first-run if it exists to check if init() creates
    // a new one
    const firstRunFileExists = await fs.exists('test/mockFiles/bin/.first-run')

    if (firstRunFileExists) {
      await fs.remove('test/mockFiles/bin/.first-run')
    }

    const schema = {
      autorun: {
        type: 'object',
        default: {},
        properties: {
          enabled: {
            type: 'boolean',
            default: false,
          },
          remind: {
            type: 'boolean',
            default: true,
          },
          backoffRate: {
            type: 'number',
            default: 0,
          },
          interactions: {
            type: 'number',
            default: 1,
          },
          timestamp: {
            type: 'number',
            default: 0,
          },
        },
      },
    }
    const store = await init()

    // store value is returned
    expect(store.store_created).toBe(true)

    // Store constructor is called with correct arguments
    expect(Store.mock.calls[0][0]).toEqual({ name: 'settings', schema })

    // init() creates a .first-run file in mocked Binary Directory
    await expect(fs.exists('test/mockFiles/bin/.first-run')).resolves.toBe(true)
  })

  test('.get calls store.get and returns the value of provided key', async () => {
    const store = await init()
    const getValue = get('foo')

    expect(store.get).toHaveBeenLastCalledWith('foo')
    expect(getValue).toBe('bar')
  })

  test('.set calls store.set function with key-value arguments', async () => {
    const store = await init()
    set('foo', 'bar')

    expect(store.set).toHaveBeenLastCalledWith('foo', 'bar')
  })

  test('.reset calls store.reset function with provided keys', async () => {
    const store = await init()
    reset(['foo', 'bar', 'baz'])

    expect(store.reset.mock.calls[0][0][0]).toEqual(
      ['foo', 'bar', 'baz']
    )
  })
})
