import { startApp, stopApp, resetData, screenshotApp } from './utils'
import En from '../lang/en.json'

describe('Onboarding Story 1', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
    await resetData(app)
    await app.restart()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('App is running', async () => {
    const running = app.isRunning()
    expect(running).toBeTruthy()
  })

  test('App launches with correct title', async () => {
    const title = await app.browserWindow.getTitle()
    expect(title).toBe('OONI Probe')
  })

  test('First screen renders correctly', async () => {
    const heading = await app.client.getText('h1')
    expect(heading).toBe(En['Onboarding.WhatIsOONIProbe.Title'])

    const gotItButtonText = await app.client.getText(
      'button[data-testid=got-it-button]'
    )
    expect(gotItButtonText).toBe(En['Onboarding.WhatIsOONIProbe.GotIt'])

    // await screenshotApp(app, 'onboarding-what-is-ooni-probe')
  })

  test('App goes to the second screen', async () => {
    await app.client
      .$('button[data-testid=got-it-button]')
      .click()
      .pause(500)

    const headsUpText = await app.client.getText('h1')
    expect(headsUpText).toBe(En['Onboarding.ThingsToKnow.Title'])

    const mainButtonText = await app.client.getText(
      'button[data-testid=onboarding-thingstoknow-button]'
    )
    expect(mainButtonText).toMatch(/I understand/i)

    // '=text-content' queries for an anchor tag with 'text-content' as innerText
    const learnMoreLink = await app.client
      .$(`=${En['Settings.About.Content.LearnMore']}`)
      .getAttribute('href')
    expect(learnMoreLink).toMatch('https://ooni.org/about/risks/')

    // await screenshotApp(app, 'onboarding-heads-up')
  })

  test('App loads up Pop Quiz', async () => {
    await app.client
      .$('button[data-testid=onboarding-thingstoknow-button]')
      .click()

    const question1Title = await app.client.getText(
      'h4[data-testid=pop-quiz-question]'
    )
    expect(question1Title).toMatch(En['Onboarding.PopQuiz.1.Title'])

    // await screenshotApp(app, 'onboarding-pop-quiz-1')
  })

  test('App accepts first Pop Quiz Answer', async () => {
    await app.client
      .$('div[data-testid=button-pop-quiz-true]')
      .click()
      .pause(500)

    const tickAnimation = await app.client.isVisible(
      'div[data-testid=quiz-steps-tick]'
    )
    expect(tickAnimation).toBe(true)

    await app.client.pause(1500)

    // await screenshotApp(app, 'onboarding-pop-quiz-2')
  })

  test('App accepts second Pop Quiz Answer and goes to Crash Reporting page', async () => {
    const question2Title = await app.client.getText(
      'h4[data-testid=pop-quiz-question]'
    )
    expect(question2Title).toMatch(En['Onboarding.PopQuiz.2.Title'])

    await app.client
      .$('div[data-testid=button-pop-quiz-true]')
      .click()
      .pause(500)

    const tickAnimation = await app.client.isVisible(
      'div[data-testid=quiz-steps-tick]'
    )
    expect(tickAnimation).toBe(true)

    await app.client.pause(1500)

    const crashReportingHeading = await app.client.$('h1').getText()
    expect(crashReportingHeading).toMatch(En['Onboarding.Crash.Title'])

    // await screenshotApp(app, 'onboarding-crash-reporting-page')
  })

  test('App lets user opt-in for Crash Reporting', async () => {
    const noButton = await app.client
      .$('button[data-testid=button-crash-reporting-no]')
      .getText()
    const yesButton = await app.client
      .$('button[data-testid=button-crash-reporting-yes]')
      .getText()

    expect(noButton).toMatch('No')
    expect(yesButton).toMatch('Yes')

    await app.client.$('button[data-testid=button-crash-reporting-yes]').click()

    const defaultSettingsHeading = await app.client
      .$(`h1=${En['Onboarding.DefaultSettings.Title']}`)
      .getText()

    expect(defaultSettingsHeading).toMatch(
      En['Onboarding.DefaultSettings.Title']
    )

    // await screenshotApp(app, 'onboarding-default-settings')
  })

  test('Finishing Onboarding process brings up the Dashboard', async () => {
    await app.client
      .$('button[data-testid=letsgo]')
      .click()
      .pause(1000)

    await app.client.waitUntilWindowLoaded()

    const runButtonExists = app.client.isVisible(
      'button[data-testid=button-dashboard-run]'
    )
    expect(runButtonExists).toBeTruthy()

    // await screenshotApp(app, 'onboarding-success')
  })

  test('Check if Crash Reporting is enabled in Settings', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-settings]')
      .click()
      .pause(1000)

    const crashReportSelected = await app.client.isSelected(
      '[data-testid=send_crash_reports]'
    )
    expect(crashReportSelected).toBeTruthy()
  })
})

describe('Onboarding Story 2', () => {
  let app

  beforeAll(async () => {
    // Start app -> reset app -> close app
    // ===> As a result, when the app starts up the next time,
    //      it starts from the onboarding screen
    app = await startApp()
    await resetData(app)
    await stopApp(app)

    app = await startApp()
    await resetData(app)
    await app.restart()
  })

  afterAll(async () => {
    await stopApp(app)
  })

  afterEach(async () => {
    await screenshotApp(app, expect.getState().currentTestName)
  })

  test('App plays cross animation and shows warning if first pop quiz answer is wrong', async () => {
    await app.client
      .$('button[data-testid=got-it-button]')
      .click()
      .pause(500)

    await app.client
      .$('button[data-testid=onboarding-thingstoknow-button]')
      .click()
      .pause(500)

    await app.client
      .$('div[data-testid=button-pop-quiz-false]')
      .click()
      .pause(500)

    const crossAnimation = await app.client.isVisible(
      'div[data-testid=quiz-steps-cross]'
    )
    expect(crossAnimation).toBe(true)

    await app.client.pause(1500)

    const warningText =
      'OONI Probe is not a privacy tool. Anyone monitoring your internet activity will see which software you are running.'

    const isWarningTextDisplayed = await app.client.isVisible(
      `div=${warningText}`
    )
    expect(isWarningTextDisplayed).toBe(true)
  })

  test('App plays cross animation and shows warning if second pop quiz answer is wrong', async () => {

    await app.client
      .$('div[data-testid=button-pop-quiz-continue]')
      .click()
      .pause(500)

    await app.client
      .$('div[data-testid=button-pop-quiz-false]')
      .click()
      .pause(500)

    const crossAnimation = await app.client.isVisible(
      'div[data-testid=quiz-steps-cross]'
    )
    expect(crossAnimation).toBe(true)

    await app.client.pause(1500)

    const warningText =
      'To increase transparency of internet censorship, the network data of all OONI Probe users is automatically published (unless they opt-out in the settings).'

    const isWarningTextDisplayed = await app.client.isVisible(
      `div=${warningText}`
    )
    expect(isWarningTextDisplayed).toBe(true)

    await app.client
      .$('div[data-testid=button-pop-quiz-continue]')
      .click()
      .pause(500)
  })

  test('App lets user opt out of Crash Reporting', async () => {
    const crashReportingHeading = await app.client.$('h1').getText()
    expect(crashReportingHeading).toMatch(En['Onboarding.Crash.Title'])

    await app.client
      .$('button[data-testid=button-crash-reporting-no]')
      .click()
      .pause(500)

    const defaultSettingsHeading = await app.client
      .$(`h1=${En['Onboarding.DefaultSettings.Title']}`)
      .getText()

    expect(defaultSettingsHeading).toMatch(
      En['Onboarding.DefaultSettings.Title']
    )
  })

  test('Finishing Onboarding process brings up the Dashboard', async () => {
    await app.client
      .$('button[data-testid=letsgo]')
      .click()
      .pause(1000)

    await app.client.waitUntilWindowLoaded()

    const runButtonExists = app.client.isVisible(
      'button[data-testid=button-dashboard-run]'
    )
    expect(runButtonExists).toBeTruthy()
  })

  test('Check if Crash Reporting is disabled in Settings', async () => {
    await app.client
      .$('div[data-testid=sidebar-item-settings]')
      .click()
      .pause(1000)

    const crashReportSelected = await app.client.isSelected(
      '[data-testid=send_crash_reports]'
    )
    expect(crashReportSelected).toBeFalsy()
  })
})
