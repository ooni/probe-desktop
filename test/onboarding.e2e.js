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

    const gotItButtonText = await app.client.getText('button[data-testid=got-it-button]')
    expect(gotItButtonText).toBe(En['Onboarding.WhatIsOONIProbe.GotIt'])
  })

  test('App goes to the second screen', async () => {
    await app.client.$('button[data-testid=got-it-button]').click()

    const headsUpText = await app.client.getText('h1')
    expect(headsUpText).toBe(En['Onboarding.ThingsToKnow.Title'])
  })
})

// describe('Onboardingx', function() {

//   let app

//   beforeAll(async function() {
//     jest.setTimeout(30000)
//   })
  
//   beforeEach(async () => {
//     // Launch the app
//     app = await startApp()
//     // Purge the config before running tests
//     await resetData(app)

//   })

//   afterEach(async function() {
//     await stopApp(app)
//   })

//   it('launches the app with onboarding screen', async function() {
//     await expect(app.browserWindow.getTitle()).resolves.toBe('OONI Probe')
//     await expect(app.client.getUrl()).resolves.toMatch(/onboard/)
//   })

//   it('first screen renders correctly', async function() {
//     await expect(app.client.getText('h1'))
//       .resolves.toBe('What is OONI Probe?')
//   })

//   it('goes to second screen', async function() {
//     await expect(app.client
//       .$('button')
//       .click()
//       .getText('h1')
//     ).resolves.toBe('Heads-up!')
//   })

//   it('goes to pop quiz', async function() {
//     await expect(app.client
//       .$('button')
//       .click()
//       .getText('h3')
//     ).resolves.toBe('Pop Quiz')
//     await expect(app.client
//       .getText('h4[data-testid=pop-quiz-question]')
//     ).resolves.toBe('Question 1/2')
//   })

//   it('accepts first pop quiz answer correctly', async function() {
//     await expect(app.client
//       .$('div=True')
//       .click()
//       .pause(2000)
//       .getText('h4[data-testid=pop-quiz-question]')
//     ).resolves.toBe('Question 2/2')
//   })

//   it('accepts second pop quiz answer correctly', async function() {
//     await expect(app.client
//       .$('div=True')
//       .click()
//       .pause(2000)
//       .getText('h1')
//     ).resolves.toBe('Crash Reporting')
//   })

//   it('allows opting in to crash reporting', async function() {
//     await expect(app.client
//       .$('button=Yes')
//       .click()
//       .pause(2000)
//       .getText('h1')
//     ).resolves.toBe('Default Settings')
//   })

//   it('finishes onboarding and shows dashboard', async function () {
//     await expect(app.client
//       .click('button[data-testid=letsgo]')
//       .pause(1000)
//       .getText('button[data-testid=dashboard-run-button]')
//     ).resolves.toBe('Run')
//     screenshotApp(app, 'onboarding-success')
//   })

//   it('confirm crash reporting is enabled in settings', async function () {
//     await expect(app.client
//       .click('div=Settings')
//       .getText('h3')
//     ).resolves.toBe('Settings')
//     await expect(app.client
//       .isSelected('[data-testid="advanced.send_crash_reports"]')
//     ).resolves.toBe(true)
//   })
// })
