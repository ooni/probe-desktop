const { startApp, stopApp } = require('./utils')

describe.skip('Dashboard', () => {

  let app

  beforeAll(async () => {
    jest.setTimeout(30000)
    // Launch the app
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  it('5 test cards are visible', async () => {
    await expect(app.client
      .isVisible('div[data-test-id|="card"]')
    ).resolves.toHaveProperty('length', 5)
  })

  it('Cards show correct test names', async () => {

  })
})
