import { startApp, stopApp } from './utils'
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
    await app.client.$('div[data-testid=run-card-im]').click().pause(1500)

    await app.client.$('button[data-testid=button-run-test]').click().pause(1500)

    const preparingTestsVisible = await app.client.isVisible(
      'span=Preparing test...'
    )
    expect(preparingTestsVisible).toBe(true)
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
        expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(2500)
  })

  test('Test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-im]')
      .click()
      .pause(2500)

    const rowResultLength = await app.client.$$(
      'div[data-testid=measured-test-name]'
    )

    expect(rowResultLength).toHaveLength(4)

    await app.client
      .$('div[data-testid=measured-test-name]')
      .click()
      .pause(2000)
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
    await app.client.$('div[data-testid=run-card-websites]').click().pause(1500)

    await app.client.$('button[data-testid=button-run-test]').click().pause(1500)

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

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-websites]'
        )
        expect(animationVisible).toBe(false)
      },
      { timeout: 300000 }
    )

    await app.client.pause(2500)
  })

  test('Website test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-websites]')
      .click()
      .pause(2000)

    await app.client
      .$('div[data-testid=measured-url-row]')
      .click()
      .pause(2000)

    await waitFor(
      async () => {
        const explorerButtonVisible = await app.client.isVisible(
          'button[data-testid=button-show-in-explorer]'
        )
        expect(explorerButtonVisible).toBe(true)
      },
      { timeout: 20000 }
    )

    const explorerButtonText = await app.client.getText(
      'button[data-testid=button-show-in-explorer]'
    )
    expect(explorerButtonText).toBe('Show In OONI Explorer')
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
    await app.client.$('div[data-testid=run-card-websites]').click().pause(1500)

    await app.client.$('button[data-testid=button-choose-websites]').click().pause(1500)

    const runButtonEnabled = await app.client.isEnabled(
      'button[data-testid=button-run-custom-test]'
    )

    expect(runButtonEnabled).toBe(false)
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
  })

  test('Runs the custom websites test', async () => {
    await app.client.$('button[data-testid=button-run-custom-test]').click().pause(1500)

    const headingTestGroupName = await app.client.getText(
      'h2[data-testid=heading-test-group-name]'
    )
    expect(headingTestGroupName).toBe('Websites')

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
  })

  test('Custom website test finishes correctly', async () => {
    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-websites]'
        )
        expect(animationVisible).toBe(false)
      },
      { timeout: 300000 }
    )

    await app.client.pause(2500)
  })

  test('Custom website test result is browsable', async () => {
    await app.client
      .$('div[data-testid=test-result-websites]')
      .click()
      .pause(2000)

    await app.client
      .$('div[data-testid=measured-url-row]')
      .click()
      .pause(2000)

    const measuredURL = await app.client.getText('div[data-testid=measurement-title]')
    expect(measuredURL).toBe('https://www.twitter.com')
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
    await app.client.$('div[data-testid=run-card-circumvention]').click().pause(1500)

    await app.client.$('button[data-testid=button-run-test]').click().pause(1500)

    const preparingTestsVisible = await app.client.isVisible(
      'span=Preparing test...'
    )
    expect(preparingTestsVisible).toBe(true)
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

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-circumvention]'
        )
        expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(2500)
  })

  test('Circumvention test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-circumvention]')
      .click()
      .pause(2500)

    const rowResultLength = await app.client.$$(
      'div[data-testid=measured-test-name]'
    )

    expect(rowResultLength).toHaveLength(3)

    await app.client
      .$('div[data-testid=measured-test-name]')
      .click()
      .pause(2000)
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
      .pause(1500)

    await app.client
      .$('button[data-testid=button-run-test]')
      .click()
      .pause(1500)

    const preparingTestsVisible = await app.client.isVisible(
      'span=Preparing test...'
    )
    expect(preparingTestsVisible).toBe(true)
  })

  test('Performance test performs both network tests', async () => {
    await waitFor(
      async () => {
        const psiphonTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(psiphonTestName).toBe('DASH Streaming Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const riseupVpnTestName = await app.client.getText(
          'div[data-testid=text-running-test-name]'
        )
        return expect(riseupVpnTestName).toBe('NDT Speed Test')
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-performance]'
        )
        expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(2500)
  })

  test('Performance test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-performance]')
      .click()
      .pause(2500)

    const rowResultLength = await app.client.$$(
      'div[data-testid=measured-test-name]'
    )

    expect(rowResultLength).toHaveLength(2)

    await app.client
      .$('div[data-testid=measured-test-name]')
      .click()
      .pause(2000)
  })
})
