import { startApp, stopApp, screenshotApp } from './utils'
import { waitFor } from '@testing-library/dom'

jest.setTimeout(600000)

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

    await app.client.waitUntil(
      () => app.client.isVisible('button[data-testid=button-run-test]'),
      120000
    )

    await screenshotApp(app, 'runtest-description-im')

    await app.client
      .$('button[data-testid=button-run-test]')
      .click()
      .pause(500)

    await app.client.waitUntilTextExists(
      'h3[data-testid=heading-running-test-name]',
      'Preparing test...',
      120000
    )
  })

  test('IM test runs with all 4 network tests', async () => {
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Facebook Messenger Test',
      120000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Telegram Test',
      120000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'WhatsApp Test',
      120000
    )
    await app.client.waitUntilTextExists(
      'div[data-testid=text-running-test-name]',
      'Signal Test',
      120000
    )

    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-im]'
        )) === false,
      120000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      120000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-im]')
    ).resolves.toContain(true)
  })
})

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
      120000
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
      120000
    )
    await app.client.waitUntilTextExists(
      'h3[data-testid=heading-running-test-name]',
      'Running:',
      120000
    )

    await app.client.waitUntil(
      async () =>
        (await app.client.isVisible(
          'div[data-testid=running-animation-websites]'
        )) === false,
      120000
    )
  })

  test('Loads Test Results page on completion', async () => {
    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () => app.client.isVisible('div[data-testid=overview-tests]'),
      120000
    )

    await expect(
      app.client.isVisible('div[data-testid=test-result-websites]')
    ).resolves.toContain(true)
  })
})

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

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-choose-websites]')
        ).resolves.toBe(true),
      { timeout: 120000 }
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

    await waitFor(
      async () =>
        expect(
          app.client.getText('h2[data-testid=heading-test-group-name]')
        ).resolves.toBe('Websites'),
      { timeout: 120000 }
    )

    const headingPreparingTests = await app.client.getText(
      'h3[data-testid=heading-running-test-name]'
    )
    expect(headingPreparingTests).toBe('Preparing test...')
  })

  test('Tests custom URLs', async () => {
    await waitFor(
      async () => {
        const processingURL = await app.client.getText(
          'div[data-testid=test-progress-message]'
        )
        return expect(processingURL).toBe(
          'processing input: https://www.twitter.com'
        )
      },
      { timeout: 300000 }
    )

    await waitFor(
      async () => {
        const processingURL = await app.client.getText(
          'div[data-testid=test-progress-message]'
        )
        return expect(processingURL).toBe(
          'processing input: https://www.facebook.com'
        )
      },
      { timeout: 300000 }
    )

    await screenshotApp(app, 'runtest-running-websites-custom')
  })

  test('Custom website test finishes correctly', async () => {
    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-websites]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 300000 }
    )

    await app.client.pause(2500)
  })

  test('Loads Test Results page on completion', async () => {
    await waitFor(
      async () =>
        expect(
          app.client.isVisible('div[data-testid=overview-tests]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )
  })
})

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

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-run-test]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )

    await app.client
      .$('button[data-testid=button-run-test]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(app.client.isVisible('span=Preparing test...')).resolves.toBe(
          true
        ),
      { timeout: 120000 }
    )
  })

  test('Circumvention test runs with all 3 network tests', async () => {
    await waitFor(
      async () => {
        const psiphonTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(psiphonTestName).toBe('Psiphon Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const riseupVpnTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(riseupVpnTestName).toBe('RiseupVPN Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const torTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(torTestName).toBe('Tor Test')
      },
      { timeout: 120000 }
    )

    await screenshotApp(app, 'runtest-running-circumvention')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-circumvention]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(2500)
  })

  test('Loads Test Results page on completion', async () => {
    await waitFor(
      async () =>
        expect(
          app.client.isVisible('div[data-testid=overview-tests]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )
  })
})

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

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-run-test]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'runtest-description-performance')

    await app.client
      .$('button[data-testid=button-run-test]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(app.client.isVisible('span=Preparing test...')).resolves.toBe(
          true
        ),
      { timeout: 120000 }
    )
  })

  test('Performance test performs both network tests', async () => {
    await waitFor(
      async () => {
        const dashStreamingText = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(dashStreamingText).toBe('DASH Streaming Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const ndtSpeedText = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(ndtSpeedText).toBe('NDT Speed Test')
      },
      { timeout: 120000 }
    )

    await screenshotApp(app, 'runtest-running-performance')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-performance]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(2500)
  })

  test('Loads Test Results page on completion', async () => {
    await waitFor(
      async () =>
        expect(
          app.client.isVisible('div[data-testid=overview-tests]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )
  })
})

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

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-run-test]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'runtest-description-middlebox')

    await app.client
      .$('button[data-testid=button-run-test]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(app.client.isVisible('span=Preparing test...')).resolves.toBe(
          true
        ),
      { timeout: 120000 }
    )
  })

  test('Middleboxes test performs both network tests', async () => {
    await waitFor(
      async () => {
        const httpRequestLine = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(httpRequestLine).toBe('HTTP Invalid Request Line Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const httpHeaderField = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(httpHeaderField).toBe(
          'HTTP Header Field Manipulation Test'
        )
      },
      { timeout: 120000 }
    )

    await screenshotApp(app, 'runtest-running-circumvention')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-middlebox]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(2500)
  })

  test('Loads Test Results page on completion', async () => {
    await waitFor(
      async () =>
        expect(
          app.client.isVisible('div[data-testid=overview-tests]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )
  })
})
