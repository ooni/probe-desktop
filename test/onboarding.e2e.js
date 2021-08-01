import { startApp, stopApp, resetData, screenshotApp } from './utils'
import En from '../lang/en.json'

describe('Onboarding', () => {
  let app

  beforeAll(async () => {
    app = await startApp()
    await resetData(app)
  })

  afterAll(async () => {
    await stopApp(app)
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

    await screenshotApp(app, 'onboarding-what-is-ooni-probe')
  })

  test('App goes to the second screen', async () => {
    await app.client.$('button[data-testid=got-it-button]').click()

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

    await screenshotApp(app, 'onboarding-heads-up')
  })

  test('App loads up Pop Quiz', async () => {
    await app.client
      .$('button[data-testid=onboarding-thingstoknow-button]')
      .click()

    const question1Title = await app.client.getText(
      'h4[data-testid=pop-quiz-question]'
    )
    expect(question1Title).toMatch(En['Onboarding.PopQuiz.1.Title'])

    await screenshotApp(app, 'onboarding-pop-quiz-1')
  })

  test('App accepts first Pop Quiz Answer', async () => {
    await app.client
      .$(`div=${En['Onboarding.PopQuiz.True']}`)
      .click()
      .pause(500)

    const tickAnimation = await app.client.isVisible('div[data-testid=quiz-steps-tick]')
    expect(tickAnimation).toBe(true)

    await app.client.pause(1500)
    
    await screenshotApp(app, 'onboarding-pop-quiz-2')
  })

  test('App accepts second Pop Quiz Answer and goes to Crash Reporting page', async () => {
    const question2Title = await app.client.getText(
      'h4[data-testid=pop-quiz-question]'
    )
    expect(question2Title).toMatch(En['Onboarding.PopQuiz.2.Title'])

    await app.client
      .$(`div=${En['Onboarding.PopQuiz.True']}`)
      .click()
      .pause(500)

    const tickAnimation = await app.client.isVisible('div[data-testid=quiz-steps-tick]')
    expect(tickAnimation).toBe(true)

    await app.client.pause(1500)
    
    const crashReportingHeading = await app.client.$('h1').getText()
    expect(crashReportingHeading).toMatch(En['Onboarding.Crash.Title'])

    await screenshotApp(app, 'onboarding-crash-reporting-page')
  })

  test('App lets user opt-in for Crash Reporting', async () => {
    const noButton = await app.client.$(
      'button[data-testid=button-crash-reporting-no]'
    ).getText()
    const yesButton = await app.client.$(
      'button[data-testid=button-crash-reporting-yes]'
    ).getText()

    expect(noButton).toMatch('No')
    expect(yesButton).toMatch('Yes')

    await app.client.$('button[data-testid=button-crash-reporting-yes]').click()

    const defaultSettingsHeading = await app.client
      .$(`h1=${En['Onboarding.DefaultSettings.Title']}`)
      .getText()
      
    expect(defaultSettingsHeading).toMatch(
      En['Onboarding.DefaultSettings.Title']
    )

    await screenshotApp(app, 'onboarding-default-settings')
  })

  test('Finishing Onboarding process brings up the Dashboard', async () => {
    await app.client.$('button[data-testid=letsgo]').click().pause(500)

    const runButtonExists = app.client.isVisible('button[data-testid=button-dashboard-run]')
    expect(runButtonExists).toBeTruthy()

    await screenshotApp(app, 'onboarding-success')
  })

  test('Check if Crash Reporting is enabled in Settings', async () => {
    await app.client.$('div=Settings').click()

    const crashReportSelected = await app.client.isSelected('[data-testid="advanced.send_crash_reports"]')
    expect(crashReportSelected).toBeTruthy()
  })
})