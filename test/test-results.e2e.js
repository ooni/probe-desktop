import { startApp, stopApp, screenshotApp } from './utils'
import { waitFor } from '@testing-library/dom'

describe('Tests for Test-Results screen', () => {
  let app

  beforeAll(async () => {
    app = await startApp()

    await app.client
      .$('div=Test Results')
      .click()
      .pause(1500)

    await screenshotApp(app, 'test-results-after-run')
  })

  afterAll(async () => {
    await stopApp(app)
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
        .pause(1500)
    })

    test('There are total 4 IM measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name')
      expect(rows).toHaveLength(4)
    })

    test('Result rows displayed for all 4 tests', async () => {
      const testedApps = await app.client.getText(
        'div div[data-testid=measured-test-name'
      )
      expect(testedApps).toEqual([
        'Telegram Test',
        'Facebook Messenger Test',
        'WhatsApp Test',
        'Signal Test',
      ])

      await screenshotApp(app, 'test-results-measurements-im')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$('div[data-testid=measured-test-name')
        .click()
        .pause(1500)

      await waitFor(
        async () =>
          expect(
            app.client.getText('h4[data-testid=heading-test-name-full]')
          ).resolves.toBe('Telegram Test'),
        { timeout: 120000 }
      )

      await screenshotApp(app, 'test-results-detailed-im')
    })

    test('Explorer button is displayed with correct link', async () => {
      await waitFor(
        async () =>
          expect(
            app.client.isVisible('button[data-testid=button-show-in-explorer]')
          ).resolves.toBe(true),
        { timeout: 120000 }
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
      expect(explorerButtonHref.substr(38)).toContain('_telegram_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/telegram/')
    })

    test('Data button loads up raw data', async () => {
      await app.client.$('button[data-testid=button-data-raw]').click()

      await waitFor(
        async () => expect(app.client.isVisible('h3=Data')).resolves.toBe(true),
        { timeout: 2500 }
      )
    })
  })

  // Websites
  describe('Website test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div=Test Results')
        .click()
        .pause(1500)

      await app.client
        .$('div[data-testid=test-result-websites]')
        .click()
        .pause(1500)
    })

    test('There is at least one URL row', async () => {
      const testedURLs = await app.client.$$(
        'div div[data-testid=measured-url-row'
      )
      expect(testedURLs.length).toBeGreaterThanOrEqual(1)

      await screenshotApp(app, 'test-results-measurements-websites')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$('div[data-testid=measured-url-row')
        .click()
        .pause(1500)

      await waitFor(
        async () =>
          expect(
            app.client.isVisible('h4[data-testid=heading-test-name-full]')
          ).resolves.toBe(true),
        { timeout: 120000 }
      )

      await screenshotApp(app, 'test-results-detailed-websites')
    })

    test('Explorer button is displayed with correct link', async () => {
      await waitFor(
        async () =>
          expect(
            app.client.isVisible('button[data-testid=button-show-in-explorer]')
          ).resolves.toBe(true),
        { timeout: 120000 }
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
      await app.client.$('button[data-testid=button-data-raw]').click()

      await waitFor(
        async () => expect(app.client.isVisible('h3=Data')).resolves.toBe(true),
        { timeout: 2500 }
      )
    })
  })

  // Circumvention
  describe('Circumvention test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div=Test Results')
        .click()
        .pause(1500)

      await app.client
        .$('div[data-testid=test-result-circumvention]')
        .click()
        .pause(1500)
    })

    test('There are total 3 Circumvention measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name')
      expect(rows).toHaveLength(3)
    })

    test('Result rows displayed for all 3 tests', async () => {
      const testedApps = await app.client.getText(
        'div div[data-testid=measured-test-name'
      )
      expect(testedApps).toEqual(['Psiphon Test', 'RiseupVPN Test', 'Tor Test'])

      await screenshotApp(app, 'test-results-measurements-circumvention')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$('div[data-testid=measured-test-name')
        .click()
        .pause(1500)

      await waitFor(
        async () =>
          expect(
            app.client.getText('h4[data-testid=heading-test-name-full]')
          ).resolves.toBe('Psiphon Test'),
        { timeout: 120000 }
      )

      await screenshotApp(app, 'test-results-detailed-circumvention')
    })

    test('Explorer button is displayed with correct link', async () => {
      await waitFor(
        async () =>
          expect(
            app.client.isVisible('button[data-testid=button-show-in-explorer]')
          ).resolves.toBe(true),
        { timeout: 120000 }
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
      expect(explorerButtonHref.substr(38)).toContain('_psiphon_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/psiphon/')
    })

    test('Data button loads up raw data', async () => {
      await app.client.$('button[data-testid=button-data-raw]').click()

      await waitFor(
        async () => expect(app.client.isVisible('h3=Data')).resolves.toBe(true),
        { timeout: 2500 }
      )
    })
  })

  // Performance
  describe('Performance test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div=Test Results')
        .click()
        .pause(1500)

      await app.client
        .$('div[data-testid=test-result-performance]')
        .click()
        .pause(1500)
    })

    test('There are total 2 Performance measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name')
      expect(rows).toHaveLength(2)
    })

    test('Result rows displayed for all 2 tests', async () => {
      const testedParams = await app.client.getText(
        'div div[data-testid=measured-test-name'
      )
      expect(testedParams).toEqual(['DASH Streaming Test', 'NDT Speed Test'])

      await screenshotApp(app, 'test-results-measurements-performance')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$('div[data-testid=measured-test-name')
        .click()
        .pause(1500)

      await waitFor(
        async () =>
          expect(
            app.client.getText('h4[data-testid=heading-test-name-full]')
          ).resolves.toBe('DASH Streaming Test'),
        { timeout: 120000 }
      )

      await screenshotApp(app, 'test-results-detailed-performance')
    })

    test('Explorer button is displayed with correct link', async () => {
      await waitFor(
        async () =>
          expect(
            app.client.isVisible('button[data-testid=button-show-in-explorer]')
          ).resolves.toBe(true),
        { timeout: 120000 }
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
      expect(explorerButtonHref.substr(38)).toContain('_dash_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/dash/')
    })

    test('Data button loads up raw data', async () => {
      await app.client.$('button[data-testid=button-data-raw]').click()

      await waitFor(
        async () => expect(app.client.isVisible('h3=Data')).resolves.toBe(true),
        { timeout: 2500 }
      )
    })
  })

  // Middleboxs
  describe('Middleboxes test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div=Test Results')
        .click()
        .pause(1500)

      await app.client
        .$('div[data-testid=test-result-middlebox]')
        .click()
        .pause(1500)
    })

    test('There are total 2 Middlebox measurements', async () => {
      const rows = await app.client.$$('div[data-testid=measured-test-name')
      expect(rows).toHaveLength(2)
    })

    test('Result rows displayed for all 2 tests', async () => {
      const testedParams = await app.client.getText(
        'div div[data-testid=measured-test-name'
      )
      expect(testedParams).toEqual(['HTTP Invalid Request Line Test', 'HTTP Header Field Manipulation Test'])

      await screenshotApp(app, 'test-results-measurements-middlebox')
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client
        .$('div[data-testid=measured-test-name')
        .click()
        .pause(1500)

      await waitFor(
        async () =>
          expect(
            app.client.getText('h4[data-testid=heading-test-name-full]')
          ).resolves.toBe('HTTP Invalid Request Line Test'),
        { timeout: 120000 }
      )

      await screenshotApp(app, 'test-results-detailed-middlebox')
    })

    test('Explorer button is displayed with correct link', async () => {
      await waitFor(
        async () =>
          expect(
            app.client.isVisible('button[data-testid=button-show-in-explorer]')
          ).resolves.toBe(true),
        { timeout: 120000 }
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
      expect(explorerButtonHref.substr(38)).toContain('_httpinvalidrequestline_')
    })

    test('Methodology link is correctly displayed', async () => {
      await expect(
        app.client.getAttribute('=Methodology', 'href')
      ).resolves.toBe('https://ooni.org/nettest/http-invalid-request-line/')
    })

    test('Data button loads up raw data', async () => {
      await app.client.$('button[data-testid=button-data-raw]').click()

      await waitFor(
        async () => expect(app.client.isVisible('h3=Data')).resolves.toBe(true),
        { timeout: 2500 }
      )
    })
  })
})
