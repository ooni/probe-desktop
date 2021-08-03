import { startApp, stopApp, screenshotApp } from './utils'
import { waitFor } from '@testing-library/dom'

describe('Tests for Test-Results screen', () => {
  let app

  beforeAll(async () => {
    app = await startApp()

    await app.client
      .$('div=Test Results')
      .click()
      .pause(500)

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

  describe('IM test measurements', () => {
    beforeAll(async () => {
      await app.client
        .$('div[data-testid=test-result-im]')
        .click()
        .pause(500)
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
    })

    test('Detailed Measurements load up correctly', async () => {
      await app.client.$('div[data-testid=measured-test-name').click().pause(500)

      await waitFor(
        async () =>
          expect(
            app.client.getText('h4[data-testid=heading-test-name-full]')
          ).resolves.toBe('Telegram Test'),
        { timeout: 120000 }
      )

      await screenshotApp(app, 'test-results-im-detailed')
    })

    test('Button to view result in Explorer is displayed with correct link', async () => {
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
      expect(explorerButtonHref.substr(38)).toContain('telegram')
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
