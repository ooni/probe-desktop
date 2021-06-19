/**
 * @jest-environment jsdom
 */
import React from 'react'
import {
  screen,
  render,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider, FormattedMessage } from 'react-intl'
import English from '../../../../lang/en.json'

import QuizSteps from '../QuizSteps'

const renderComponent = (component, locale = 'en', messages = English) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>
  )
}

describe('Tests for QuizSteps', () => {
  const toggleQuiz = jest.fn()
  const onQuizComplete = jest.fn()

  beforeEach(() => {
    renderComponent(
      <QuizSteps
        onClose={toggleQuiz}
        onDone={onQuizComplete}
        questionList={[
          <FormattedMessage
            key="Onboarding.PopQuiz.1.Question"
            id="Onboarding.PopQuiz.1.Question"
          />,
          <FormattedMessage
            key="Onboarding.PopQuiz.2.Question"
            id="Onboarding.PopQuiz.2.Question"
          />,
        ]}
        actuallyList={[
          <FormattedMessage
            key="Onboarding.PopQuiz.1.Wrong.Paragraph"
            id="Onboarding.PopQuiz.1.Wrong.Paragraph"
          />,
          <FormattedMessage
            key="Onboarding.PopQuiz.2.Wrong.Paragraph"
            id="Onboarding.PopQuiz.2.Wrong.Paragraph"
          />,
        ]}
      />
    )
  })

  afterEach(() => {
    onQuizComplete.mockClear()
  })

  test('User Story with correct answers', async () => {
    const yesButton1 = screen.getByText(English['Onboarding.PopQuiz.True'])
    fireEvent.click(yesButton1)
    const lottiePlayerFirst = screen.getByTestId('quiz-steps-animation')
    await waitForElementToBeRemoved(lottiePlayerFirst, { timeout: 2000 })
    const heading = screen.getByText(English['Onboarding.PopQuiz.2.Title'])
    const yesButton2 = screen.getByText(English['Onboarding.PopQuiz.True'])
    expect(heading).toBeInTheDocument()
    fireEvent.click(yesButton2)
    const lottiePlayerSecond = screen.getByTestId('quiz-steps-animation')
    await waitForElementToBeRemoved(lottiePlayerSecond, { timeout: 2000 })
    expect(onQuizComplete).toHaveBeenCalledTimes(1)
  })

  test('User Story with incorrect answers', async () => {
    const falseButton1 = screen.getByText(English['Onboarding.PopQuiz.False'])
    fireEvent.click(falseButton1)
    const lottiePlayer1 = screen.getByTestId('quiz-steps-animation')
    await waitForElementToBeRemoved(lottiePlayer1, { timeout: 2000 })
    const warningParagraph1 = screen.getByText(
      English['Onboarding.PopQuiz.1.Wrong.Paragraph']
    )
    const continueButton1 = screen.getByText(
      English['Onboarding.PopQuiz.Wrong.Button.Continue']
    )
    expect(warningParagraph1).toBeInTheDocument()
    fireEvent.click(continueButton1)
    const quizHeading2 = await screen.findByText(
      English['Onboarding.PopQuiz.2.Title']
    )
    expect(quizHeading2).toBeInTheDocument()
    const falseButton2 = screen.getByText(English['Onboarding.PopQuiz.False'])
    fireEvent.click(falseButton2)
    const lottiePlayer2 = screen.getByTestId('quiz-steps-animation')
    await waitForElementToBeRemoved(lottiePlayer2, { timeout: 2000 })
    const warningParagraph2 = screen.getByText(
      English['Onboarding.PopQuiz.2.Wrong.Paragraph']
    )
    const continueButton2 = screen.getByText(
      English['Onboarding.PopQuiz.Wrong.Button.Continue']
    )
    expect(warningParagraph2).toBeInTheDocument()
    fireEvent.click(continueButton2)
    expect(onQuizComplete).toHaveBeenCalledTimes(1)
  })
})
