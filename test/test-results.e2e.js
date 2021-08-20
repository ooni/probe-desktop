import { startApp, stopApp, screenshotApp, resetData } from './utils'

jest.setTimeout(600000)

describe('Tests for Test-Results screen', () => {
  let app

  beforeAll(async () => {
    app = await startApp()

    await app.client
      .$('div[data-testid=sidebar-item-test-results]')
      .click()
      .pause(1000)

    await app.client.waitUntilWindowLoaded()

    await screenshotApp(app, 'test-results-after-run')
  })

  afterAll(async () => {
    await resetData(app)
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test.onMac('Enable Autorun on Mac', async () => {
    await app.client.waitUntil(
      async () =>
        app.client.isVisible('div[data-testid=modal-autorun-confirmation]'),
      30000
    )

    await app.client
    .$('button[data-testid=button-autorun-yes]')
    .click()
    .pause(500)

    await app.client.waitUntilWindowLoaded()
  })

  test.onWindows('Enable Autorun on Mac', async () => {
    await app.client.waitUntil(
      async () =>
        app.client.isVisible('div[data-testid=modal-autorun-confirmation]'),
      30000
    )

    await app.client
    .$('button[data-testid=button-autorun-yes]')
    .click()
    .pause(500)

    await app.client.waitUntilWindowLoaded()
  })

  test('Page shows two IM measurement result rows', async () => {
    const rows = await app.client.$$('div[data-testid=test-result-im]')
    expect(rows).toHaveLength(2)
  })

  test('Page shows three Websites measurement result rows', async () => {
    const rows = await app.client.$$('div[data-testid=test-result-websites]')
    expect(rows).toHaveLength(3)
  })

  test('Page shows two Circumvention test result rows', async () => {
    const rows = await app.client.$$(
      'div[data-testid=test-result-circumvention]'
    )
    expect(rows).toHaveLength(2)
  })

  test('Page shows two Middleboxes test result rows', async () => {
    const rows = await app.client.$$('div[data-testid=test-result-middlebox]')
    expect(rows).toHaveLength(2)
  })

  test('Page shows two Performance test result rows', async () => {
    const rows = await app.client.$$('div[data-testid=test-result-performance]')
    expect(rows).toHaveLength(2)
  })

  // IM
  describe('IM test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div[data-testid=test-result-im]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()
    })

    test('There are total 4 IM measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name]')
      expect(rows).toHaveLength(4)
    })

    test('Result rows displayed for all 4 tests', async () => {
      const testedApps = await app.client.getText(
        'div div[data-testid=measured-test-name]'
      )
      expect(testedApps.sort()).toEqual(
        [
          'Telegram Test',
          'Facebook Messenger Test',
          'WhatsApp Test',
          'Signal Test',
        ].sort()
      )

      // await screenshotApp(app, 'test-results-measurements-im')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$$('div[data-testid=measured-test-name]')
        .$('div=Signal Test')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntilTextExists(
        'h4[data-testid=heading-test-name-full]',
        'Signal Test',
        120000
      )

      // await screenshotApp(app, 'test-results-detailed-im')
    })

    test('Explorer button is displayed with correct link', async () => {
      await app.client.waitUntil(
        () =>
          app.client.isVisible('button[data-testid=button-show-in-explorer]'),
        120000
      )

      const explorerButtonText = await app.client.getText(
        'button[data-testid=button-show-in-explorer]'
      )
      expect(explorerButtonText).toBe('Show In OONI Explorer')

      const explorerButtonHref = await app.client.getAttribute(
        'button[data-testid=button-show-in-explorer]',
        'href'
      )

      expect(explorerButtonHref.substr(0, 37)).toMatch(
        'https://explorer.ooni.org/measurement'
      )
      expect(explorerButtonHref.substr(38)).toContain('_signal_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/signal/')
    })

    test('Data button loads up raw data', async () => {
      await app.client
        .$('button[data-testid=button-data-raw]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntil(
        () => app.client.isVisible('div[data-testid=container-json-viewer]'),
        120000
      )

      await expect(
        app.client.getText('h3[data-testid=heading-json-viewer]')
      ).resolves.toBe('Data')

      await expect(
        app.client.isVisible('div[data-testid=data-json-viewer]')
      ).resolves.toBe(true)
    })
  })

  // Websites
  describe('Website test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div[data-testid=sidebar-item-test-results]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client
        .$('div[data-testid=test-result-websites]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()
    })

    test('There is at least one URL row', async () => {
      const testedURLs = await app.client.$$(
        'div div[data-testid=measured-url-row'
      )
      expect(testedURLs.length).toBeGreaterThanOrEqual(1)

      // await screenshotApp(app, 'test-results-measurements-websites')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$('div[data-testid=measured-url-row')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntil(
        () => app.client.isVisible('h4[data-testid=heading-test-name-full]'),
        120000
      )

      // await screenshotApp(app, 'test-results-detailed-websites')
    })

    test('Explorer button is displayed with correct link', async () => {
      await app.client.waitUntil(
        () =>
          app.client.isVisible('button[data-testid=button-show-in-explorer]'),
        120000
      )

      const explorerButtonText = await app.client.getText(
        'button[data-testid=button-show-in-explorer]'
      )
      expect(explorerButtonText).toBe('Show In OONI Explorer')

      const explorerButtonHref = await app.client.getAttribute(
        'button[data-testid=button-show-in-explorer]',
        'href'
      )

      expect(explorerButtonHref.substr(0, 37)).toMatch(
        'https://explorer.ooni.org/measurement'
      )
      expect(explorerButtonHref.substr(38)).toContain('_webconnectivity_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/web-connectivity/')
    })

    test('Data button loads up raw data', async () => {
      await app.client
        .$('button[data-testid=button-data-raw]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntil(
        () => app.client.isVisible('div[data-testid=container-json-viewer]'),
        120000
      )

      await expect(
        app.client.getText('h3[data-testid=heading-json-viewer]')
      ).resolves.toBe('Data')

      await expect(
        app.client.isVisible('div[data-testid=data-json-viewer]')
      ).resolves.toBe(true)
    })
  })

  // Circumvention
  describe('Circumvention test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div[data-testid=sidebar-item-test-results]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client
        .$('div[data-testid=test-result-circumvention]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()
    })

    test('There are total 3 Circumvention measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name]')
      expect(rows).toHaveLength(3)
    })

    test('Result rows displayed for all 3 tests', async () => {
      const testedApps = await app.client.getText(
        'div div[data-testid=measured-test-name]'
      )
      expect(testedApps.sort()).toEqual(
        ['Psiphon Test', 'RiseupVPN Test', 'Tor Test'].sort()
      )

      // await screenshotApp(app, 'test-results-measurements-circumvention')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$$('div[data-testid=measured-test-name]')
        .$('div=Tor Test')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntilTextExists(
        'h4[data-testid=heading-test-name-full]',
        'Tor Test',
        120000
      )

      // await screenshotApp(app, 'test-results-detailed-circumvention')
    })

    test('Explorer button is displayed with correct link', async () => {
      await app.client.waitUntil(
        () =>
          app.client.isVisible('button[data-testid=button-show-in-explorer]'),
        120000
      )

      const explorerButtonText = await app.client.getText(
        'button[data-testid=button-show-in-explorer]'
      )
      expect(explorerButtonText).toBe('Show In OONI Explorer')

      const explorerButtonHref = await app.client.getAttribute(
        'button[data-testid=button-show-in-explorer]',
        'href'
      )

      expect(explorerButtonHref.substr(0, 37)).toMatch(
        'https://explorer.ooni.org/measurement'
      )
      expect(explorerButtonHref.substr(38)).toContain('_tor_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/tor')
    })

    test('Data button loads up raw data', async () => {
      await app.client
        .$('button[data-testid=button-data-raw]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntil(
        () => app.client.isVisible('div[data-testid=container-json-viewer]'),
        120000
      )

      await expect(
        app.client.getText('h3[data-testid=heading-json-viewer]')
      ).resolves.toBe('Data')

      await expect(
        app.client.isVisible('div[data-testid=data-json-viewer]')
      ).resolves.toBe(true)
    })
  })

  // Performance
  describe('Performance test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div[data-testid=sidebar-item-test-results]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client
        .$('div[data-testid=test-result-performance]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()
    })

    test('There are total 2 Performance measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name]')
      expect(rows).toHaveLength(2)
    })

    test('Result rows displayed for all 2 tests', async () => {
      const testedParams = await app.client.getText(
        'div div[data-testid=measured-test-name]'
      )
      expect(testedParams.sort()).toEqual(
        ['DASH Streaming Test', 'NDT Speed Test'].sort()
      )

      // await screenshotApp(app, 'test-results-measurements-performance')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$$('div[data-testid=measured-test-name]')
        .$('div=NDT Speed Test')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntilTextExists(
        'h4[data-testid=heading-test-name-full]',
        'NDT Speed Test',
        120000
      )

      // await screenshotApp(app, 'test-results-detailed-performance')
    })

    test('Explorer button is displayed with correct link', async () => {
      await app.client.waitUntil(
        () =>
          app.client.isVisible('button[data-testid=button-show-in-explorer]'),
        120000
      )

      const explorerButtonText = await app.client.getText(
        'button[data-testid=button-show-in-explorer]'
      )
      expect(explorerButtonText).toBe('Show In OONI Explorer')

      const explorerButtonHref = await app.client.getAttribute(
        'button[data-testid=button-show-in-explorer]',
        'href'
      )

      expect(explorerButtonHref.substr(0, 37)).toMatch(
        'https://explorer.ooni.org/measurement'
      )
      expect(explorerButtonHref.substr(38)).toContain('_ndt_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/ndt/')
    })

    test('Data button loads up raw data', async () => {
      await app.client
        .$('button[data-testid=button-data-raw]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntil(
        () => app.client.isVisible('div[data-testid=container-json-viewer]'),
        120000
      )

      await expect(
        app.client.getText('h3[data-testid=heading-json-viewer]')
      ).resolves.toBe('Data')

      await expect(
        app.client.isVisible('div[data-testid=data-json-viewer]')
      ).resolves.toBe(true)
    })
  })

  // Middleboxes
  describe('Middleboxes test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div[data-testid=sidebar-item-test-results]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client
        .$('div[data-testid=test-result-middlebox]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()
    })

    test('There are total 2 Middlebox measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name]')
      expect(rows).toHaveLength(2)
    })

    test('Result rows displayed for all 2 tests', async () => {
      const testedParams = await app.client.getText(
        'div div[data-testid=measured-test-name]'
      )
      expect(testedParams.sort()).toEqual(
        [
          'HTTP Invalid Request Line Test',
          'HTTP Header Field Manipulation Test',
        ].sort()
      )

      // await screenshotApp(app, 'test-results-measurements-middlebox')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$$('div[data-testid=measured-test-name]')
        .$('div=HTTP Header Field Manipulation Test')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntilTextExists(
        'h4[data-testid=heading-test-name-full]',
        'HTTP Header Field Manipulation Test',
        120000
      )

      // await screenshotApp(app, 'test-results-detailed-middlebox')
    })

    test('Explorer button is displayed with correct link', async () => {
      await app.client.waitUntil(
        () =>
          app.client.isVisible('button[data-testid=button-show-in-explorer]'),
        120000
      )

      const explorerButtonText = await app.client.getText(
        'button[data-testid=button-show-in-explorer]'
      )
      expect(explorerButtonText).toBe('Show In OONI Explorer')

      const explorerButtonHref = await app.client.getAttribute(
        'button[data-testid=button-show-in-explorer]',
        'href'
      )

      expect(explorerButtonHref.substr(0, 37)).toMatch(
        'https://explorer.ooni.org/measurement'
      )
      expect(explorerButtonHref.substr(38)).toContain(
        '_httpheaderfieldmanipulation_'
      )
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe(
        'https://ooni.org/nettest/http-header-field-manipulation/'
      )
    })

    test('Data button loads up raw data', async () => {
      await app.client
        .$('button[data-testid=button-data-raw]')
        .click()
        .pause(1000)

      await app.client.waitUntilWindowLoaded()

      await app.client.waitUntil(
        () => app.client.isVisible('div[data-testid=container-json-viewer]'),
        120000
      )

      await expect(
        app.client.getText('h3[data-testid=heading-json-viewer]')
      ).resolves.toBe('Data')

      await expect(
        app.client.isVisible('div[data-testid=data-json-viewer]')
      ).resolves.toBe(true)
    })
  })
})
