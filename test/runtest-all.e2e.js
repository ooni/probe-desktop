import { startApp, stopApp, screenshotApp } from './utils'

jest.setTimeout(600000)

describe('All network tests run successfully', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('Tests start successfully on click of RUN button', async () => {
    await app.utils.click('button[data-testid=button-dashboard-run]')

    await app.client.waitUntil(
      () => app.utils.isDisplayed('h3[data-testid=heading-running-test-name]'),
      { timeout: 300000 }
    )

    await expect(
      app.utils.getText('h3[data-testid=heading-running-test-name]')
    ).resolves.toBe('Preparing test...')

    // await screenshotApp(app, 'runtestall-started')
  })

  test('Website test runs from start to finish', async () => {
    await app.client.waitUntilTextExists(
      'h2[data-testid=heading-test-group-name]',
      'Websites',
      300000
    )

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Web Connectivity Test',
      300000
    )

    await app.client.waitUntilTextExists(
      'h3[data-testid=heading-running-test-name]',
      'Running:',
      300000
    )

    const animationVisible = await app.utils.isDisplayed(
      'div[data-testid=running-animation-websites]'
    )
    expect(animationVisible).toBe(true)

    await screenshotApp(app, 'runtestall-websites')

    await app.client.setTimeout({ implicit: 0 })

    await app.client.waitUntil(
      async () =>
        (await app.utils.isDisplayed(
          'div[data-testid=running-animation-websites]'
        )) === false,
      { timeout: 300000 }
    )
  })

  test('Circumvention test runs from start to finish', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntilTextExists(
      'h2[data-testid=heading-test-group-name]',
      'Circumvention',
      300000
    )

    const animationVisible = await app.utils.isDisplayed(
      'div[data-testid=running-animation-circumvention]'
    )
    expect(animationVisible).toBe(true)

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Psiphon Test',
      300000
    )

    // await app.client.waitUntilTextExists(
    //   'div[data-testid=text-running-test-name]',
    //   'RiseupVPN Test',
    //   300000
    // )

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Tor Test',
      300000
    )

    await screenshotApp(app, 'runtestall-circumvention')

    await app.client.waitUntil(
      async () =>
        (await app.utils.isDisplayed(
          'div[data-testid=running-animation-circumvention]'
        )) === false,
      { timeout: 300000 }
    )
  })

  test('IM test runs from start to finish', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntilTextExists(
      'h2[data-testid=heading-test-group-name]',
      'Instant Messaging',
      300000
    )

    const animationVisible = await app.utils.isDisplayed(
      'div[data-testid=running-animation-im]'
    )
    expect(animationVisible).toBe(true)

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Facebook Messenger Test',
      10000
    )

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Telegram Test',
      10000
    )

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'WhatsApp Test',
      10000
    )

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Signal Test',
      10000
    )

    await screenshotApp(app, 'runtestall-im')

    await app.client.waitUntil(
      async () =>
        (await app.utils.isDisplayed(
          'div[data-testid=running-animation-circumvention]'
        )) === false,
      { timeout: 300000 }
    )
  })

  test('Middleboxes test runs from start to finish', async () => {

    await app.client.waitUntilTextExists(
      'h2[data-testid=heading-test-group-name]',
      'Middleboxes',
      300000
    )

    const animationVisible = await app.utils.isDisplayed(
      'div[data-testid=running-animation-middlebox]'
    )
    expect(animationVisible).toBe(true)

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'HTTP Invalid Request Line Test',
      300000
    )

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'HTTP Header Field Manipulation Test',
      300000
    )

    await screenshotApp(app, 'runtestall-middlebox')

    await app.client.waitUntil(
      async () =>
        (await app.utils.isDisplayed(
          'div[data-testid=running-animation-circumvention]'
        )) === false,
      { timeout: 300000 }
    )
  })

  test('Performance test runs from start to finish', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntilTextExists(
      'h2[data-testid=heading-test-group-name]',
      'Performance',
      300000
    )

    const animationVisible = await app.utils.isDisplayed(
      'div[data-testid=running-animation-performance]'
    )
    expect(animationVisible).toBe(true)

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'DASH Streaming Test',
      300000
    )

    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'NDT Speed Test',
      300000
    )

    await screenshotApp(app, 'runtestall-performance')

    await app.client.waitUntil(
      async () =>
        (await app.utils.isDisplayed(
          'div[data-testid=running-animation-performance]'
        )) === false,
      { timeout: 300000 }
    )
  })

  test('Experimental test runs from start to finish', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntilTextExists(
      'h2[data-testid=heading-test-group-name]',
      'Experimental',
      300000
    )

    const animationVisible = await app.utils.isDisplayed(
      'div[data-testid=running-animation-experimental]'
    )
    expect(animationVisible).toBe(true)

    await screenshotApp(app, 'runtestall-experimental')

    await app.client.waitUntil(
      async () =>
        (await app.utils.isDisplayed(
          'div[data-testid=running-animation-experimental]'
        )) === false,
      { timeout: 300000 }
    )
  })
})
