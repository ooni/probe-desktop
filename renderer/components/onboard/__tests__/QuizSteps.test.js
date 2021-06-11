/**
 * @jest-environment jsdom
 */

import { screen, render, fireEvent, cleanup } from "@testing-library/react";
import { theme } from "ooni-components";
import { ThemeProvider } from "styled-components";
import { IntlProvider, FormattedMessage } from "react-intl";
import English from "../../../../lang/en.json";

import QuizSteps from "../QuizSteps";

const renderComponent = (component, locale = "en", messages = English) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>
  );
};

describe("Tests for QuizSteps", () => {

  const toggleQuiz = jest.fn()
  const onQuizComplete = jest.fn()

  beforeEach(() => {
    renderComponent(
      <QuizSteps
      onClose={toggleQuiz}
      onDone={onQuizComplete}
      questionList={[
        <FormattedMessage key='Onboarding.PopQuiz.1.Question' id='Onboarding.PopQuiz.1.Question' />,
        <FormattedMessage key='Onboarding.PopQuiz.2.Question' id='Onboarding.PopQuiz.2.Question' />
      ]}
      actuallyList={[
        <FormattedMessage key='Onboarding.PopQuiz.1.Wrong.Paragraph' id='Onboarding.PopQuiz.1.Wrong.Paragraph' />,
        <FormattedMessage key='Onboarding.PopQuiz.2.Wrong.Paragraph' id='Onboarding.PopQuiz.2.Wrong.Paragraph' />
      ]}
    />
    )
  })

  afterEach(() => {
    onQuizComplete.mockClear()
  })

  test("User Story with correct answers", async () => {
    const yesButton1 = screen.getByText(English['Onboarding.PopQuiz.True'])
    fireEvent.click(yesButton1)
    await new Promise(resolve => setTimeout(() => {
      const heading = screen.getByText(English['Onboarding.PopQuiz.2.Title'])
      const yesButton2 = screen.getByText(English['Onboarding.PopQuiz.True'])
      expect(heading).toBeInTheDocument()
      fireEvent.click(yesButton2)
      resolve()
    }, 1650))
    await new Promise(resolve => setTimeout(() => {
      expect(onQuizComplete).toHaveBeenCalledTimes(1)
      resolve()
    }, 1650))
  });

  test("User Story with incorrect answers", async () => {
    const falseButton1 = screen.getByText(English['Onboarding.PopQuiz.False'])
    fireEvent.click(falseButton1)
    await new Promise(resolve => setTimeout(() => {
      const warningParagraph = screen.getByText(English['Onboarding.PopQuiz.1.Wrong.Paragraph'])
      const continueButton = screen.getByText(English['Onboarding.PopQuiz.Wrong.Button.Continue'])
      expect(warningParagraph).toBeInTheDocument()
      fireEvent.click(continueButton)
      resolve()
    }, 1650))
    const quizHeading2 = await screen.findByText(English['Onboarding.PopQuiz.2.Title'])
    expect(quizHeading2).toBeInTheDocument()
    const falseButton2 = screen.getByText(English['Onboarding.PopQuiz.False'])
    fireEvent.click(falseButton2)
    await new Promise(resolve => setTimeout(() => {
      const warningParagraph = screen.getByText(English['Onboarding.PopQuiz.2.Wrong.Paragraph'])
      const continueButton = screen.getByText(English['Onboarding.PopQuiz.Wrong.Button.Continue'])
      expect(warningParagraph).toBeInTheDocument()
      fireEvent.click(continueButton)
      expect(onQuizComplete).toHaveBeenCalledTimes(1)
      resolve()
    }, 1650))
  });
});
