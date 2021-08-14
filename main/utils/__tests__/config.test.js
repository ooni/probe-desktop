import {
  availableCategoriesList,
  initializeConfig,
  initConfigFile,
  getConfig,
  setConfig,
  maybeMigrate,
} from '../config'

import log from 'electron-log'
import fs from 'fs-extra'
import Sentry from '../sentry'

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
    getAutorunHomeDir: jest.fn(() => 'test/mockFiles/autorun'),
    getBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
  }
})

jest.mock('../sentry')

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
      crashReportsOptIn: true,
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
  beforeEach(() => {
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
      configFilePath: 'test/mockFiles/configWithCrashReporting.json',
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

    await initConfigFile(options)

    const config = fs.readJSONSync(
      'test/mockFiles/configWithCrashReporting.json'
    )

    expect(config).toEqual(expectedConfigValue)
  })

  test('Sentry is initialised on initializing config file', async () => {
    await initConfigFile()
    expect(Sentry).toHaveBeenCalledTimes(1)
  })
})

describe('Tests for getConfig', () => {
  test('getConfig returns valid config when no key is passed', async () => {
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

    const config = await getConfig()

    expect(config).toEqual(expectedConfigValue)
  })

  test('getConfig returns correct value when key is passed', async () => {
    const websites_enabled_category_codes = await getConfig(
      'nettests.websites_enabled_category_codes'
    )
    expect(websites_enabled_category_codes).toEqual(availableCategoriesList)

    const send_crash_reports = await getConfig('advanced.send_crash_reports')
    expect(send_crash_reports).toBe(false)
  })
})

describe('Tests for setConfig', () => {
  test('setConfig returns expected config value', async () => {
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

    const updatedConfig = await setConfig(
      'advanced.send_crash_reports',
      false,
      true
    )

    expect(updatedConfig).toEqual(expectedConfigValue)
  })

  test('setConfig updates both ooni_home and ooni_home_autorun config files', async () => {
    // Creating a mock autorun config file to make sure
    // setConfig syncs changes to autorun config as well
    await fs.ensureFile('test/mockFiles/autorun/config.json')

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

    await setConfig('advanced.send_crash_reports', true, false)

    const ooniHomeConfig = await fs.readJSON('test/mockFiles/config.json')
    const ooniAutorunConfig = await fs.readJSON(
      'test/mockFiles/autorun/config.json'
    )

    expect(ooniHomeConfig).toEqual(expectedConfigValue)
    expect(ooniAutorunConfig).toEqual(expectedConfigValue)
  })
})

describe('Migration tests', () => {

  test('Migrate 0->5', async () => {

    // Draft config which will be modified as migrations happen
    const draftConfig = {
      _version: 0,
      _informed_consent: true,
      sharing: {
        include_country: false,
        upload_results: true,
        include_ip: true,
        include_asn: true,
      },
      nettests: {
        websites_url_limit: 10,
      },
      advanced: {
        collect_usage_stats: true,
        use_domain_fronting: false,
        send_crash_reports: false,
        collector_url: '',
        bouncer_url: 'https://bouncer.ooni.io',
      },
    }

    const expectedConfigValue = {
      _version: 5,
      _informed_consent: true,
      sharing: {
        upload_results: false,
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

    // Creating the draft config file
    await fs.ensureFile('test/mockFiles/migrate/ooni_home/config.json')
    await fs.writeJson(
      'test/mockFiles/config.json',
      draftConfig,
      { spaces: '  ' }
    )
    const initialConfig = await fs.readJSON(
      'test/mockFiles/config.json'
    )
    expect(initialConfig['_version']).toBe(0)

    await maybeMigrate()

    const finalConfig = await fs.readJSON(
      'test/mockFiles/config.json'
    )
    expect(finalConfig['_version']).toBe(5)
    expect(finalConfig).toEqual(expectedConfigValue)
  })
})
