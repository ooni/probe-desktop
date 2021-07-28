import { startApp, stopApp } from './utils'
import { waitFor } from '@testing-library/dom'

describe('Tests for Test-Results screen', () => {
  let app

  beforeAll(async () => {
    app = await startApp()

    await app.client
      .$('div=Test Results')
      .click()
      .pause(500)
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
    const rows = await app.client.$$('div[data-testid=test-result-circumvention]')
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
})
