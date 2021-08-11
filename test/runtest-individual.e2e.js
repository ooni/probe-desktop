import { startApp, stopApp, screenshotApp } from './utils'

jest.setTimeout(600000)

// IM Test
describe('IM test', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('IM test successfully starts', async () => {
    await app.client
      .$('div[data-testid=run-card-im]')
      .click()
      .pause(1000)

    await screenshotApp(app, 'runtest-description-im')

    await app.client.waitUntil(
      () => app.client.isVisible('button[data-testid=button-run-test]'),
      300000
    )

    await app.client.$('button[data-testid=button-run-test]').click()

    await app.client.waitUntilWindowLoaded()
    const headingTestGroupName = await app.client.getText(
      'h2[data-testid=heading-test-group-name]'
    )
    expect(headingTestGroupName).toBe('Instant Messaging')

    const headingPreparingTests = await app.client.getText(
      'h3[data-testid=heading-running-test-name]'
    )
    expect(headingPreparingTests).toBe('Preparing test...')
  })

  test('IM test runs with all 4 network tests', async () => {
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Facebook Messenger Test',
      300000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Telegram Test',
      300000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'WhatsApp Test',
      300000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Signal Test',
      300000
    )

    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-im]'
        )) === false,
      300000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      300000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-im]')
    ).resolves.toBe(true)
  })
})

// Websites Test
describe('Websites test', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Website measurement test loads correctly', async () => {
    await app.client
      .$('div[data-testid=run-card-websites]')
      .click()
      .pause(1000)

    await app.client.waitUntil(
      () => app.client.isVisible('button[data-testid=button-run-test]'),
      300000
    )

    await screenshotApp(app, 'runtest-description-websites')

    await app.client
      .$('button[data-testid=button-run-test]')
      .click()
      .pause(500)

    const headingTestGroupName = await app.client.getText(
      'h2[data-testid=heading-test-group-name]'
    )
    expect(headingTestGroupName).toBe('Websites')

    const headingPreparingTests = await app.client.getText(
      'h3[data-testid=heading-running-test-name]'
    )
    expect(headingPreparingTests).toBe('Preparing test...')
  })

  test('Website network runs successfully', async () => {
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

    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-websites]'
        )) === false,
      300000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      300000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-websites]')
    ).resolves.toBe(true)
  })
})

// Custom websites test
describe('Custom websites test', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Run button is disabled by default', async () => {
    await app.client
      .$('div[data-testid=run-card-websites]')
      .click()
      .pause(1000)

    await app.client.waitUntil(
      () => app.client.isVisible('button[data-testid=button-choose-websites]'),
      300000
    )

    await app.client
      .$('button[data-testid=button-choose-websites]')
      .click()
      .pause(1000)

    const runButtonEnabled = await app.client.isEnabled(
      'button[data-testid=button-run-custom-test]'
    )

    expect(runButtonEnabled).toBe(false)

    await screenshotApp(app, 'runtest-custom-websites-choose')
  })

  test('Allows entering custom URLs', async () => {
    await app.client
      .$('input[data-testid=input-add-url-0]')
      .setValue('https://www.twitter.com')

    await app.client.$('button[data-testid=button-add-url]').click()

    await app.client
      .$('input[data-testid=input-add-url-1]')
      .setValue('https://www.facebook.com')

    const runButtonEnabled = await app.client.isEnabled(
      'button[data-testid=button-run-custom-test]'
    )

    expect(runButtonEnabled).toBe(true)

    await screenshotApp(app, 'runtest-custom-websites-chosen')
  })

  test('Runs the custom websites test', async () => {
    await app.client
      .$('button[data-testid=button-run-custom-test]')
      .click()
      .pause(1000)

    await app.client.waitUntilTextExists(
      'h2[data-testid=heading-test-group-name]',
      'Websites',
      300000
    )

    const headingPreparingTests = await app.client.getText(
      'h3[data-testid=heading-running-test-name]'
    )
    expect(headingPreparingTests).toBe('Preparing test...')
  })

  test('Tests custom URLs', async () => {
    await app.client.waitUntilTextExists(
      'div[data-testid=test-progress-message]',
      'processing input: https://www.twitter.com',
      300000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=test-progress-message]',
      'processing input: https://www.facebook.com',
      300000
    )

    await screenshotApp(app, 'runtest-running-websites-custom')
  })

  test('Custom website test finishes correctly', async () => {
    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-websites]'
        )) === false,
      300000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      300000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-websites]')
    ).resolves.toBe(true)
  })
})

// Circumvention Test
describe('Circumvention test', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Circumvention test successfully starts', async () => {
    await app.client
      .$('div[data-testid=run-card-circumvention]')
      .click()
      .pause(1000)

    await screenshotApp(app, 'runtest-description-circumvention')

    await app.client.waitUntil(
      () => app.client.isVisible('button[data-testid=button-run-test]'),
      300000
    )

    await app.client.$('button[data-testid=button-run-test]').click()

    await app.client.waitUntilWindowLoaded()
    const headingTestGroupName = await app.client.getText(
      'h2[data-testid=heading-test-group-name]'
    )
    expect(headingTestGroupName).toBe('Circumvention')

    const headingPreparingTests = await app.client.getText(
      'h3[data-testid=heading-running-test-name]'
    )
    expect(headingPreparingTests).toBe('Preparing test...')
  })

  test('Circumvention test runs with all 3 network tests', async () => {
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Psiphon Test',
      300000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'RiseupVPN Test',
      300000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Tor Test',
      300000
    )

    await screenshotApp(app, 'runtest-running-circumvention')

    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-cirumvention]'
        )) === false,
      300000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      300000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-circumvention]')
    ).resolves.toBe(true)
  })
})

// Performance Test
describe('Performance test', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Performance test successfully starts', async () => {
    await app.client
      .$('div[data-testid=run-card-performance]')
      .click()
      .pause(1000)

    await screenshotApp(app, 'runtest-description-performance')

    await app.client.waitUntil(
      () => app.client.isVisible('button[data-testid=button-run-test]'),
      300000
    )

    await app.client.$('button[data-testid=button-run-test]').click()

    await app.client.waitUntilWindowLoaded()
    const headingTestGroupName = await app.client.getText(
      'h2[data-testid=heading-test-group-name]'
    )
    expect(headingTestGroupName).toBe('Performance')

    const headingPreparingTests = await app.client.getText(
      'h3[data-testid=heading-running-test-name]'
    )
    expect(headingPreparingTests).toBe('Preparing test...')
  })

  test('Performance test performs both network tests', async () => {

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

    await screenshotApp(app, 'runtest-running-performance')

    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-performance]'
        )) === false,
      300000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      300000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-performance]')
    ).resolves.toBe(true)
  })
})


// Middleboxes test
describe('Middleboxes test', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Middleboxes test successfully starts', async () => {
    await app.client
      .$('div[data-testid=run-card-middlebox]')
      .click()
      .pause(1000)

    await screenshotApp(app, 'runtest-description-middlebox')

    await app.client.waitUntil(
      () => app.client.isVisible('button[data-testid=button-run-test]'),
      300000
    )

    await app.client.$('button[data-testid=button-run-test]').click()

    await app.client.waitUntilWindowLoaded()
    const headingTestGroupName = await app.client.getText(
      'h2[data-testid=heading-test-group-name]'
    )
    expect(headingTestGroupName).toBe('Middleboxes')

    const headingPreparingTests = await app.client.getText(
      'h3[data-testid=heading-running-test-name]'
    )
    expect(headingPreparingTests).toBe('Preparing test...')
  })

  test('Middleboxes test performs both network tests', async () => {

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

    await screenshotApp(app, 'runtest-running-circumvention')

    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-middlebox]'
        )) === false,
      300000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      300000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-middlebox]')
    ).resolves.toBe(true)
  })
})
