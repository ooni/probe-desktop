const { startApp, stopApp } = require('./utils')

beforeAll(() => {
  jest.setTimeout(30000)
})

describe.skip('Sidebar Works', () => {
  let app

  beforeEach(async () => {
    app = await startApp()
    return app
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      await stopApp(app)
    }
  })

  it('has window title set to "OONI Probe"', async () => {
    const title = await app.browserWindow.getTitle()
    expect(title).toBe('OONI Probe')
  })
})
