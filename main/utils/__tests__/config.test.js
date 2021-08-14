import { availableCategoriesList, initializeConfig, initConfigFile } from '../config'
import log from 'electron-log'
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

jest.mock('../paths', () => {
  return {
    getHomeDir: jest.fn(() => 'test/mockFiles'),
    getBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
  }
})


describe('Config Initialization', () => {
  test('initializeConfig returns expected config value when opts object is not passed', async () => {
    const expectedConfigValue = {
      _version: 5,
      _informed_consent: true,
      sharing: {
        upload_results: true,
      },
      nettests: {
        websites_enabled_category_codes: availableCategoriesList,
        websites_enable_max_runtime: true,
        websites_max_runtime: 90,
      },
      advanced: {
        use_domain_fronting: false,
        send_crash_reports: undefined,
        collector_url: '',
        bouncer_url: 'https://bouncer.ooni.io',
      },
    }

    const initializedConfigValue = initializeConfig()

    expect(initializedConfigValue).toEqual(expectedConfigValue)
  })

  test('initializeConfig returns expected config value when an opts object is passed', async () => {
    const opts = {
      crashReportsOptIn: true
    }
    const expectedConfigValue = {
      _version: 5,
      _informed_consent: true,
      sharing: {
        upload_results: true,
      },
      nettests: {
        websites_enabled_category_codes: availableCategoriesList,
        websites_enable_max_runtime: true,
        websites_max_runtime: 90,
      },
      advanced: {
        use_domain_fronting: false,
        send_crash_reports: true,
        collector_url: '',
        bouncer_url: 'https://bouncer.ooni.io',
      },
    }

    const initializedConfigValue = initializeConfig(opts)

    expect(initializedConfigValue).toEqual(expectedConfigValue)
  })
})

describe('Tests for initConfigFile', () => {
  beforeAll(() => {
    jest.clearAllMocks()
  })

  test('Config file is initialized in test/mockFiles with defaultOptions', async () => {

    const expectedConfigValue = {
      _version: 5,
      _informed_consent: true,
      sharing: {
        upload_results: true,
      },
      nettests: {
        websites_enabled_category_codes: availableCategoriesList,
        websites_enable_max_runtime: true,
        websites_max_runtime: 90,
      },
      advanced: {
        use_domain_fronting: false,
        send_crash_reports: false,
        collector_url: '',
        bouncer_url: 'https://bouncer.ooni.io',
      },
    }

    // Initializing config file
    await initConfigFile()

    // Reading config from the generated config file
    const config = fs.readJSONSync('test/mockFiles/config.json')

    expect(config).toEqual(expectedConfigValue)
  })

  test('Config file is initialized in test/mockFiles with provided options', async () => {

    const options = {
      crashReportsOptIn: true,
      configFilePath: 'test/mockFiles/configWithCrashReporting.json'
    }

    const expectedConfigValue = {
      _version: 5,
      _informed_consent: true,
      sharing: {
        upload_results: true,
      },
      nettests: {
        websites_enabled_category_codes: availableCategoriesList,
        websites_enable_max_runtime: true,
        websites_max_runtime: 90,
      },
      advanced: {
        use_domain_fronting: false,
        send_crash_reports: true,
        collector_url: '',
        bouncer_url: 'https://bouncer.ooni.io',
      },
    }

    // Initializing config file
    await initConfigFile(options)

    // Reading config from the generated config file
    const config = fs.readJSONSync('test/mockFiles/configWithCrashReporting.json')

    expect(config).toEqual(expectedConfigValue)
  })
})