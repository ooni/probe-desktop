import { startApp, stopApp, screenshotApp } from './utils'
import { waitFor } from '@testing-library/dom'

jest.setTimeout(600000)

describe('All network tests run successfully', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('Tests start successfully on click of RUN button', async () => {
    await app.client.$('button[data-testid=button-dashboard-run]').click()

    await waitFor(
      async () => {
        const preparingTestsVisible = await app.client.isVisible(
          'span=Preparing test...'
        )
        return expect(preparingTestsVisible).toBe(true)
      },
      { timeout: 120000 }
    )

    await screenshotApp(app, 'runtestall-started')
  })

  test('Website test runs from start to finish', async () => {
    await waitFor(
      async () => {
        const headingTestGroupName = await app.client.getText(
          'h2[data-testid=heading-test-group-name]'
        )
        return expect(headingTestGroupName).toBe('Websites')
      },
      { timeout: 120000 }
    )

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

    await screenshotApp(app, 'runtestall-website')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-websites]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 300000 }
    )

    await app.client.pause(1500)
  })

  test('Circumvention test runs from start to finish', async () => {
    await waitFor(
      async () => {
        const headingTestGroupName = await app.client.getText(
          'h2[data-testid=heading-test-group-name]'
        )
        return expect(headingTestGroupName).toBe('Circumvention')
      },
      { timeout: 120000 }
    )

    const animationVisible = await app.client.isVisible(
      'div[data-testid=running-animation-circumvention]'
    )
    expect(animationVisible).toBe(true)

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

    await screenshotApp(app, 'runtestall-circumvention')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-circumvention]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(1500)
  })

  test('IM test runs from start to finish', async () => {
    await waitFor(
      async () => {
        const headingTestGroupName = await app.client.getText(
          'h2[data-testid=heading-test-group-name]'
        )
        return expect(headingTestGroupName).toBe('Instant Messaging')
      },
      { timeout: 120000 }
    )

    const animationVisible = await app.client.isVisible(
      'div[data-testid=running-animation-im]'
    )
    expect(animationVisible).toBe(true)

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

    await screenshotApp(app, 'runtestall-im')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-im]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(1500)
  })

  test('Middleboxes test runs from start to finish', async () => {
    await waitFor(
      async () => {
        const headingTestGroupName = await app.client.getText(
          'h2[data-testid=heading-test-group-name]'
        )
        return expect(headingTestGroupName).toBe('Middleboxes')
      },
      { timeout: 120000 }
    )

    const animationVisible = await app.client.isVisible(
      'div[data-testid=running-animation-middlebox]'
    )
    expect(animationVisible).toBe(true)

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
        return expect(httpHeaderField).toBe('HTTP Header Field Manipulation Test')
      },
      { timeout: 120000 }
    )

    await screenshotApp(app, 'runtestall-middlebox')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-middlebox]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(1500)
  })

  test('Performance test runs from start to finish', async () => {
    await waitFor(
      async () => {
        const headingTestGroupName = await app.client.getText(
          'h2[data-testid=heading-test-group-name]'
        )
        return expect(headingTestGroupName).toBe('Performance')
      },
      { timeout: 120000 }
    )

    const animationVisible = await app.client.isVisible(
      'div[data-testid=running-animation-performance]'
    )
    expect(animationVisible).toBe(true)

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
    await screenshotApp(app, 'runtestall-performance')

    await waitFor(
      async () => {
        const animationVisible = await app.client.isVisible(
          'div[data-testid=running-animation-performance]'
        )
        return expect(animationVisible).toBe(false)
      },
      { timeout: 120000 }
    )

    await app.client.pause(1500)
  })
})
