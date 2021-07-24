import { startApp, stopApp } from './utils'
import { waitFor } from '@testing-library/dom'

jest.setTimeout(300000)

describe('Tests for measurement runs', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  test('IM test successfully starts', async () => {
    await app.client.$('div[data-testid=run-card-im]').click()

    await app.client.$('button=Run').click()

    const preparingTestsVisible = await app.client.isVisible(
      'span=Preparing test...'
    )
    expect(preparingTestsVisible).toBe(true)
  })

  test('IM test runs with all 4 network tests', async () => {
    await waitFor(
      async () => {
        const whatsAppTestHeading = await app.client.isVisible(
          'div=WhatsApp Test'
        )
        return expect(whatsAppTestHeading).toBe(true)
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const signalTestHeading = await app.client.isVisible('div=Signal Test')
        return expect(signalTestHeading).toBe(true)
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

    await app.client.pause(1000)
  })

  test('Test result data is stored in an expected fashion', async () => {
    await app.client
      .$('div[data-testid=test-result-im]')
      .click()
      .pause(2000)

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
