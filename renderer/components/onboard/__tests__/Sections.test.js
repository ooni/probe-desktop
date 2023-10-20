import React from 'react'
import { screen, render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import renderer from 'react-test-renderer'
import English from '../../../../lang/en.json'

import Sections from '../Sections'

const renderComponent = (component, locale = 'en', messages = English) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>
  )
}

// const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

describe('Tests for Screen 1 of Sections component', () => {
  test('Matches snapshot', async () => {
    const component = renderer
      .create(
        <IntlProvider locale='en' messages={English}>
          <ThemeProvider theme={theme}>
            <Sections />
          </ThemeProvider>
        </IntlProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  test('Brings up the next screen', async () => {
    renderComponent(<Sections />)
    const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
    fireEvent.click(gotItButton)
    const page2Title = await screen.findByRole('heading', { name: English['Onboarding.ThingsToKnow.Title'] })
    expect(page2Title).toBeInTheDocument()
  })
  // test('CSS styles of elements are correct', async () => {
  //   renderComponent(<Sections />)
  //   const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
  //   const gotItButtonStyles = global.getComputedStyle(gotItButton)
  //   expect(rgb2hex(gotItButtonStyles.backgroundColor)).toMatch(theme.colors.white)
  //   expect(rgb2hex(gotItButtonStyles.color)).toMatch(theme.colors.primary)
  // })
})

const setup = () => {
  renderComponent(<Sections />)
  const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
  fireEvent.click(gotItButton)
}

describe('Tests for Screen 2 of Sections component', () => {
  test('Screen 2 renders content correctly', async () => {
    setup()
    const page2Title = screen.getByRole('heading', { name: English['Onboarding.ThingsToKnow.Title'] })
    const mainButton = screen.getByRole('button', { name: English['Onboarding.ThingsToKnow.Button'] })
    const goBackButton = screen.getByText(English['Onboarding.PopQuiz.Wrong.Button.Back'])
    const learnMoreButton = screen.getByText(English['Onboarding.ThingsToKnow.LearnMore'])
    expect(page2Title).toBeInTheDocument()
    expect(mainButton).toBeInTheDocument()
    expect(goBackButton).toBeInTheDocument()
    expect(learnMoreButton).toBeInTheDocument()
    expect(learnMoreButton.href).toBe('https://ooni.org/about/risks/')
  })
  test('The *Go back* link brings back screen 1', async () => {
    setup()
    const goBackButton = screen.getByText(English['Onboarding.PopQuiz.Wrong.Button.Back'])
    fireEvent.click(goBackButton)
    const page1Title = await screen.findByRole('heading', { name: English['Onboarding.WhatIsOONIProbe.Title'] })
    expect(page1Title).toBeInTheDocument()
  })
  test('Clicking on \'I Understand\' brings up Pop Quiz', async () => {
    setup()
    const mainButton = screen.getByRole('button', { name: English['Onboarding.ThingsToKnow.Button'] })
    fireEvent.click(mainButton)
    const quizTitle = await screen.findByRole('heading', { name: English['Onboarding.PopQuiz.Title'] })
    expect(quizTitle).toBeInTheDocument()
  })
  // test('CSS styles of elements are correct', async () => {
  //   setup()
  //   const mainButton = screen.getByRole('button', { name: English['Onboarding.ThingsToKnow.Button'] })
  //   expect(mainButton).toHaveStyle(`background-color: ${theme.colors.white}`)
  //   expect(mainButtonStyles.color).toMatch(theme.colors.primary)
  // })
})

describe('Tests for Screens 3 and Screen 4 of Sections component', () => {
  test('Screen 3 and Screen 4 render correctly', async () => {
    const onGo = jest.fn()
    renderComponent(<Sections onGo={ onGo } />)

    const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
    fireEvent.click(gotItButton)

    const screen2Button = screen.getByRole('button', { name: English['Onboarding.ThingsToKnow.Button'] })
    fireEvent.click(screen2Button)

    const yesButton1 = screen.getByText(English['Onboarding.PopQuiz.True'])
    fireEvent.click(yesButton1)

    const lottiePlayerFirst = screen.getByTestId('quiz-steps-tick')
    await waitForElementToBeRemoved(lottiePlayerFirst, { timeout: 2000 })

    const yesButton2 = screen.getByText(English['Onboarding.PopQuiz.True'])
    fireEvent.click(yesButton2)
    
    const lottiePlayerSecond = screen.getByTestId('quiz-steps-tick')
    await waitForElementToBeRemoved(lottiePlayerSecond, { timeout: 2000 })
    
    const popQuizTitle = screen.queryByText(English['Onboarding.PopQuiz.Title'])
    expect(popQuizTitle).not.toBeInTheDocument()
    
    const crashInfoTitle = await screen.findByText(English['Onboarding.Crash.Title'])
    expect(crashInfoTitle).toBeInTheDocument()
    const yesButton = screen.getByText(English['Onboarding.Crash.Button.Yes'])
    fireEvent.click(yesButton)

    const defaultSettingsTitle = await screen.findByText(English['Onboarding.DefaultSettings.Title'])
    expect(defaultSettingsTitle).toBeInTheDocument()
    const letsGoButton = screen.getByText(English['Onboarding.DefaultSettings.Button.Go'])
    fireEvent.click(letsGoButton)

    expect(onGo).toHaveBeenCalledTimes(1)
  })
})