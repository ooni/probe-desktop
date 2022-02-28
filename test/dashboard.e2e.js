const { startApp, stopApp, screenshotApp } = require('./utils')

describe('Dashboard tests', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('Run button is displayed on Dashboard', async () => {
    const runButtonText = await app.utils.getText(
      'button[data-testid=button-dashboard-run]'
    )

    expect(runButtonText).toMatch('Run')
  })

  describe('All 5 test cards are visible', () => {
    const testDetails = [
      {
        id: 'websites',
        name: 'Websites',
        desc: 'Test the blocking of websites',
      },
      {
        id: 'im',
        name: 'Instant Messaging',
        desc: 'Test the blocking of instant messaging apps',
      },
      {
        id: 'circumvention',
        name: 'Circumvention',
        desc: 'Test the blocking of censorship circumvention tools',
      },
      {
        id: 'performance',
        name: 'Performance',
        desc: 'Test your network speed and performance',
      },
      {
        id: 'middlebox',
        name: 'Middleboxes',
        desc: 'Detect middleboxes in your network',
      },
    ]

    testDetails.forEach((itr) => {
      test(`${itr.id} test card is visible`, async () => {
        const isCardVisible = await app.utils.isDisplayed(
          `div[data-testid=run-card-${itr.id}]`
        )
        expect(isCardVisible).toBe(true)

        const cardName = await app.utils.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-name-${itr.id}]`
        )
        expect(cardName).toBe(itr.name)

        const cardDesc = await app.utils.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-description-${itr.id}]`
        )
        expect(cardDesc).toBe(itr.desc)
      })
    })
  })

  test('Clicking on "Test Results" tab loads the Test Results Page', async () => {
    await app.utils.click(
      'div[data-testid=sidebar-item-test-results]'
    )
      
    await app.client.waitUntilWindowLoaded()

    const labelTests = await app.utils.getText(
      'div[data-testid=overview-tests]')

    const labelNetworks = await app.utils.getText(
      'div[data-testid=overview-networks]')

    const labelDataUsage = await app.utils.getText(
      'div[data-testid=overview-data-usage-label]')


    expect(labelTests).toContain('Tests')
    expect(labelNetworks).toContain('Networks')
    expect(labelDataUsage).toContain('Data Usage')

    // screenshotApp(app, 'dashboard-test-results')
  })

  test('Clicking on "Settings" tab loads the Settings page', async () => {
    await app.utils
      .click('div[data-testid=sidebar-item-settings]')
    
    await app.client.waitUntilWindowLoaded()

    // Checking for the "Settings" heading
    // Rest of the assertions are in settings.e2e.js
    const labelTestOptionsVisible = await app.utils.isDisplayed('h3=Settings')
    expect(labelTestOptionsVisible).toBe(true)

    // screenshotApp(app, 'dashboard-settings-page')
  })
})
