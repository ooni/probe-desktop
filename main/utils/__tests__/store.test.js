import log from 'electron-log'
import Store from 'electron-store'
import { init, get, set, reset } from '../store'

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
    reset: jest.fn(() => ({
      autorun: {
        enabled: false,
        remind: true,
        backoffRate: 0,
        interactions: 1,
        timestamp: 0,
      },
    })),
    get: jest.fn((key) => {
      if (key === 'autorun.enabled') return false
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

  test('init calls Store class, returns a store value', async () => {
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
  })

  test('.get calls store.get and returns the value of provided key', async () => {
    const store = await init()
    const getValue = get('autorun.enabled')

    expect(store.get).toHaveBeenLastCalledWith('autorun.enabled')
    expect(getValue).toBe(false)
  })

  test('.set calls store.set function with key-value arguments', async () => {
    const store = await init()
    set('autorun.enabled', true)

    expect(store.set).toHaveBeenLastCalledWith('autorun.enabled', true)
  })

  test('.reset calls store.reset function with provided keys and returns resetted state', async () => {
    const store = await init()
    const resettedState = reset(['autorun.enabled', 'autorun.remind'])

    expect(store.reset.mock.calls[0][0][0]).toEqual([
      'autorun.enabled',
      'autorun.remind',
    ])

    const expectedResettedState = {
      autorun: {
        enabled: false,
        remind: true,
        backoffRate: 0,
        interactions: 1,
        timestamp: 0,
      },
    }
    expect(resettedState).toEqual(expectedResettedState)
  })
})
