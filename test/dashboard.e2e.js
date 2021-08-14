import { startApp, stopApp, screenshotApp } from './utils'

describe.onLinux('Dashboard tests on Linux', () => {
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

  test('Run button is displayed on Dashboard on Linux', async () => {
    const runButtonText = await app.client
      .$('button[data-testid=button-dashboard-run]')
      .getText()

    expect(runButtonText).toMatch('Run')
  })

  describe('All 5 test cards are visible on Linux', () => {
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
      test(`${itr.id} test card is visible on Linux`, async () => {
        const isCardVisible = await app.client.isVisible(
          `div[data-testid=run-card-${itr.id}]`
        )
        expect(isCardVisible).toBe(true)

        const cardName = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-name-${itr.id}]`
        )
        expect(cardName).toBe(itr.name)

        const cardDesc = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-description-${itr.id}]`
        )
        expect(cardDesc).toBe(itr.desc)
      })
    })
  })

  test('Clicking on "Test Results" tab loads the Test Results Page on Linux', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-test-results]')
      .click()
      .pause(500)

    await app.client.waitUntilWindowLoaded()

    const labelTests = await app.client
      .$('div[data-testid=overview-tests]')
      .getText()
    const labelNetworks = await app.client
      .$('div[data-testid=overview-networks]')
      .getText()
    const labelDataUsage = await app.client
      .$('div[data-testid=overview-data-usage-label]')
      .getText()

    expect(labelTests).toContain('Tests')
    expect(labelNetworks).toContain('Networks')
    expect(labelDataUsage).toContain('Data Usage')

    // screenshotApp(app, 'dashboard-test-results')
  })

  test('Clicking on "Settings" tab loads the Settings page on Linux', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-settings]')
      .click()
      .pause(500)

    await app.client.waitUntilWindowLoaded()

    // Checking for the "Settings" heading
    // Rest of the assertions are in settings.e2e.js
    const labelTestOptionsVisible = await app.client.isVisible('h3=Settings')
    expect(labelTestOptionsVisible).toBe(true)

    // screenshotApp(app, 'dashboard-settings-page')
  })
})


describe.onMac('Dashboard tests on Mac', () => {
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

  test('Run button is displayed on Dashboard on Mac', async () => {
    const runButtonText = await app.client
      .$('button[data-testid=button-dashboard-run]')
      .getText()

    expect(runButtonText).toMatch('Run')
  })

  describe('All 5 test cards are visible on Mac', () => {
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
      test(`${itr.id} test card is visible on Mac`, async () => {
        const isCardVisible = await app.client.isVisible(
          `div[data-testid=run-card-${itr.id}]`
        )
        expect(isCardVisible).toBe(true)

        const cardName = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-name-${itr.id}]`
        )
        expect(cardName).toBe(itr.name)

        const cardDesc = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-description-${itr.id}]`
        )
        expect(cardDesc).toBe(itr.desc)
      })
    })
  })

  test('Loads up "Test Results" and opt-in for autorun on Mac', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-test-results]')
      .click()
      .pause(500)

    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () =>
        app.client.isVisible('div[data-testid=modal-autorun-confirmation]'),
      30000
    )

    await expect(
      app.client.getText('h4[data-testid=heading-autorun-confirmation]')
    ).resolves.toMatch('Would you like to run tests automatically?')

    await expect(
      app.client.getText('h4[data-testid=text-autorun-confirmation]')
    ).resolves.toMatch(
      'By enabling automatic testing, OONI Probe tests will run automatically on a regular basis (and you don’t need to remember to manually run tests).'
    )

    await expect(
      app.client.getText('button[data-testid=button-autorun-yes]')
    ).resolves.toMatch('Sounds great')

    await expect(
      app.client.getText('button[data-testid=button-autorun-no]')
    ).resolves.toMatch('No, thanks')

    await expect(
      app.client.getText('button[data-testid=button-autorun-yes]')
    ).resolves.toMatch('Sounds great')

    await app.client
      .$('button[data-testid=button-autorun-yes]')
      .click()
      .pause(500)

    const labelTests = await app.client
      .$('div[data-testid=overview-tests]')
      .getText()
    const labelNetworks = await app.client
      .$('div[data-testid=overview-networks]')
      .getText()
    const labelDataUsage = await app.client
      .$('div[data-testid=overview-data-usage-label]')
      .getText()

    expect(labelTests).toContain('Tests')
    expect(labelNetworks).toContain('Networks')
    expect(labelDataUsage).toContain('Data Usage')

    // screenshotApp(app, 'dashboard-test-results')
  })

  test('Loads up Settings page with autorun enabled on Mac', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-settings]')
      .click()
      .pause(500)

    await app.client.waitUntilWindowLoaded()

    // Checking for the "Settings" heading
    // Rest of the assertions are in settings.e2e.js
    const labelTestOptionsVisible = await app.client.isVisible('h3=Settings')
    expect(labelTestOptionsVisible).toBe(true)

    await expect(
      app.client.isSelected('input[data-testid=checkbox-autorun]')
    ).resolves.toBeTruthy()

    // screenshotApp(app, 'dashboard-settings-page')
  })
})

describe.onWindows('Dashboard tests on Windows', () => {
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

  test('Run button is displayed on Dashboard on Windows', async () => {
    const runButtonText = await app.client
      .$('button[data-testid=button-dashboard-run]')
      .getText()

    expect(runButtonText).toMatch('Run')
  })

  describe('All 5 test cards are visible on Windows', () => {
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
      test(`${itr.id} test card is visible on Windows`, async () => {
        const isCardVisible = await app.client.isVisible(
          `div[data-testid=run-card-${itr.id}]`
        )
        expect(isCardVisible).toBe(true)

        const cardName = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-name-${itr.id}]`
        )
        expect(cardName).toBe(itr.name)

        const cardDesc = await app.client.getText(
          `div[data-testid=run-card-${itr.id}] div[data-testid=run-card-description-${itr.id}]`
        )
        expect(cardDesc).toBe(itr.desc)
      })
    })
  })

  test('Loads up "Test Results" and opt-in for autorun on Windows', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-test-results]')
      .click()
      .pause(500)

    await app.client.waitUntilWindowLoaded()

    await app.client.waitUntil(
      async () =>
        app.client.isVisible('div[data-testid=modal-autorun-confirmation]'),
      30000
    )

    await expect(
      app.client.getText('h4[data-testid=heading-autorun-confirmation]')
    ).resolves.toMatch('Would you like to run tests automatically?')

    await expect(
      app.client.getText('h4[data-testid=text-autorun-confirmation]')
    ).resolves.toMatch(
      'By enabling automatic testing, OONI Probe tests will run automatically on a regular basis (and you don’t need to remember to manually run tests).'
    )

    await expect(
      app.client.getText('button[data-testid=button-autorun-yes]')
    ).resolves.toMatch('Sounds great')

    await expect(
      app.client.getText('button[data-testid=button-autorun-no]')
    ).resolves.toMatch('No, thanks')

    await expect(
      app.client.getText('button[data-testid=button-autorun-yes]')
    ).resolves.toMatch('Sounds great')

    await app.client
      .$('button[data-testid=button-autorun-yes]')
      .click()
      .pause(500)

    const labelTests = await app.client
      .$('div[data-testid=overview-tests]')
      .getText()
    const labelNetworks = await app.client
      .$('div[data-testid=overview-networks]')
      .getText()
    const labelDataUsage = await app.client
      .$('div[data-testid=overview-data-usage-label]')
      .getText()

    expect(labelTests).toContain('Tests')
    expect(labelNetworks).toContain('Networks')
    expect(labelDataUsage).toContain('Data Usage')

    // screenshotApp(app, 'dashboard-test-results')
  })

  test('Loads up Settings page with autorun enabled on Windows', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-settings]')
      .click()
      .pause(500)

    await app.client.waitUntilWindowLoaded()

    // Checking for the "Settings" heading
    // Rest of the assertions are in settings.e2e.js
    const labelTestOptionsVisible = await app.client.isVisible('h3=Settings')
    expect(labelTestOptionsVisible).toBe(true)

    await expect(
      app.client.isSelected('input[data-testid=checkbox-autorun]')
    ).resolves.toBeTruthy()

    // screenshotApp(app, 'dashboard-settings-page')
  })
})
