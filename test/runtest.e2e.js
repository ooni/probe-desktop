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

  test('IM test is run', async () => {
    await app.client.$('div[data-testid=run-card-im]').click()

    await app.client.$('button=Run').click()

    const preparingTestsVisible = await app.client.isVisible(
      'span=Preparing test...'
    )
    expect(preparingTestsVisible).toBe(true)

    await waitFor(
      async () => {
        const headingWebConnectivity = await app.client.isVisible(
          'div=WhatsApp Test'
        )
        return expect(headingWebConnectivity).toBe(true)
      },
      { timeout: 120000 }
    )

    await waitFor(
      async () => {
        const headingWebConnectivity = await app.client.isVisible(
          'div=Signal Test'
        )
        return expect(headingWebConnectivity).toBe(true)
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

    await app.client.$(
      'div[data-testid=test-result-im]'
    ).click().pause(2000)
  })
})
