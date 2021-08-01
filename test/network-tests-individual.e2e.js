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
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-run-test]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'test-description-im')

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

  test('IM test runs with all 4 network tests', async () => {
    await waitFor(
      async () => {
        const messengerTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(messengerTestName).toBe('Facebook Messenger Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const telegramTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(telegramTestName).toBe('Telegram Test')
      },
      { timeout: 120000 }
    )

    await screenshotApp(app, 'running-im')

    await waitFor(
      async () => {
        const whatsAppTestHeading = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(whatsAppTestHeading).toBe('WhatsApp Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const signalTestHeading = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(signalTestHeading).toBe('Signal Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-im]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(2500)
  })

  test('Test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-im]')
      .click()
      .pause(500)

    await screenshotApp(app, 'test-results-im')

    await waitFor(
      async () =>
        expect(
          app.client.$$('div[data-testid=measured-test-name]')
        ).resolves.toHaveLength(4),
      { timeout: 120000 }
    )

    await app.client
      .$('div[data-testid=measured-test-name]')
      .click()
      .pause(500)

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

    await screenshotApp(app, 'test-result-im-details')
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
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-run-test]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'test-description-websites')

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

  test('Website network test is run successfully', async () => {
    await waitFor(
      async () => {
        const runningTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(runningTestName).toBe('Web Connectivity Test')
      },
      { timeout: 300000 }
    )

    await waitFor(
      async () => {
        const headingRunning = await app.client.getText(
          'h3[data-testid=heading-running-test-name]'
        )
        return expect(headingRunning).toBe('Running:')
      },
      { timeout: 120000 }
    )

    await screenshotApp(app, 'running-websites')

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

  test('Website test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-websites]')
      .click()
      .pause(500)

    await screenshotApp(app, 'test-results-websites')

    await app.client
      .$('div[data-testid=measured-url-row]')
      .click()
      .pause(2000)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-show-in-explorer]')
        ).resolves.toBe(true),
      { timeout: 20000 }
    )

    const explorerButtonText = await app.client.getText(
      'button[data-testid=button-show-in-explorer]'
    )
    expect(explorerButtonText).toBe('Show In OONI Explorer')

    await screenshotApp(app, 'test-result-websites-details')
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
      .pause(500)

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
      .pause(500)

    const runButtonEnabled = await app.client.isEnabled(
      'button[data-testid=button-run-custom-test]'
    )

    expect(runButtonEnabled).toBe(false)

    await screenshotApp(app, 'test-custom-websites-choose')
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

    await screenshotApp(app, 'test-custom-websites-chosen')
  })

  test('Runs the custom websites test', async () => {
    await app.client
      .$('button[data-testid=button-run-custom-test]')
      .click()
      .pause(500)

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

    await screenshotApp(app, 'running-websites-custom')
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

  test('Custom website test result is browsable', async () => {
    await app.client
      .$('div[data-testid=test-result-websites]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.$$('div[data-testid=measured-url-row]')
        ).resolves.toHaveLength(2),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'test-results-websites-custom')

    await app.client
      .$('div[data-testid=measured-url-row]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.getText('div[data-testid=measurement-title]')
        ).resolves.toBe('https://www.twitter.com'),
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
      .pause(500)

    await screenshotApp(app, 'test-description-circumvention')

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

    await screenshotApp(app, 'running-circumvention')

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

  test('Circumvention test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-circumvention]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.$$('div[data-testid=measured-test-name]')
        ).resolves.toHaveLength(3),
      { timeout: 120000 }
    )
    
    await screenshotApp(app, 'test-results-circumvention')

    await app.client
      .$('div[data-testid=measured-test-name]')
      .click()
      .pause(2000)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-show-in-explorer]')
        ).resolves.toBe(true),
      { timeout: 20000 }
    )

    const explorerButtonText = await app.client.getText(
      'button[data-testid=button-show-in-explorer]'
    )
    expect(explorerButtonText).toBe('Show In OONI Explorer')

    await screenshotApp(app, 'test-result-circumvention-details')
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
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-run-test]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'test-description-performance')

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

    await screenshotApp(app, 'running-performance')

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

  test('Performance test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-performance]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.$$('div[data-testid=measured-test-name]')
        ).resolves.toHaveLength(2),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'test-results-performance')

    await app.client
      .$('div[data-testid=measured-test-name]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-show-in-explorer]')
        ).resolves.toBe(true),
      { timeout: 20000 }
    )

    const explorerButtonText = await app.client.getText(
      'button[data-testid=button-show-in-explorer]'
    )
    expect(explorerButtonText).toBe('Show In OONI Explorer')

    await screenshotApp(app, 'test-result-performance-details')
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
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-run-test]')
        ).resolves.toBe(true),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'test-description-middlebox')

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

    await screenshotApp(app, 'running-circumvention')

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

  test('Middleboxes test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-middlebox]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.$$('div[data-testid=measured-test-name]')
        ).resolves.toHaveLength(2),
      { timeout: 120000 }
    )

    await screenshotApp(app, 'test-results-circumvention')

    await app.client
      .$('div[data-testid=measured-test-name]')
      .click()
      .pause(500)

    await waitFor(
      async () =>
        expect(
          app.client.isVisible('button[data-testid=button-show-in-explorer]')
        ).resolves.toBe(true),
      { timeout: 20000 }
    )

    const explorerButtonText = await app.client.getText(
      'button[data-testid=button-show-in-explorer]'
    )
    expect(explorerButtonText).toBe('Show In OONI Explorer')

    await screenshotApp(app, 'test-result-circumvention-details')
  })
})
