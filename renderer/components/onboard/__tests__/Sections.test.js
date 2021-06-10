/**
 * @jest-environment jsdom
 */

import { screen, render, fireEvent, cleanup } from "@testing-library/react";
import { theme } from "ooni-components";
import { ThemeProvider } from "styled-components";
import { IntlProvider } from "react-intl";
import renderer from "react-test-renderer";
import English from "../../../../lang/en.json";

import Sections from "../Sections";

const renderComponent = (component, locale = "en", messages = English) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>
  );
};

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`


describe("Tests for Screen 1 of Sections component", () => {
  afterAll(() => {
    cleanup()
  })
  test("Matches snapshot", async () => {
    const component = renderer
      .create(
        <IntlProvider locale="en" messages={English}>
          <ThemeProvider theme={theme}>
            <Sections />
          </ThemeProvider>
        </IntlProvider>
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });
  test("Brings up the next screen", async () => {
    renderComponent(<Sections />);
    const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
    fireEvent.click(gotItButton)
    const page2Title = await screen.findByRole('heading', { name: English['Onboarding.ThingsToKnow.Title'] })
    expect(page2Title).toBeInTheDocument()
  });
  test("CSS styles of elements are correct", async () => {
    renderComponent(<Sections />);
    const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
    const gotItButtonStyles = global.getComputedStyle(gotItButton)
    expect(rgb2hex(gotItButtonStyles.backgroundColor)).toMatch(theme.colors.white)
    expect(rgb2hex(gotItButtonStyles.color)).toMatch(theme.colors.primary)
  })
});

describe("Tests for Screen 2 of Sections component", () => {
  beforeEach(() => {
    renderComponent(<Sections />);
    const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
    fireEvent.click(gotItButton)
  })
  afterEach(() => {
    cleanup()
  })
  test("Screen 2 renders content correctly", async () => {
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
  test("The *Go back* link brings back screen 1", async () => {
    const goBackButton = screen.getByText(English['Onboarding.PopQuiz.Wrong.Button.Back'])
    fireEvent.click(goBackButton)
    const page1Title = await screen.findByRole('heading', { name: English['Onboarding.WhatIsOONIProbe.Title'] })
    expect(page1Title).toBeInTheDocument()
  })
  test("Clicking on 'I Understand' brings up Pop Quiz", async () => {
    const mainButton = screen.getByRole('button', { name: English['Onboarding.ThingsToKnow.Button'] })
    fireEvent.click(mainButton)
    const quizTitle = await screen.findByRole('heading', { name: English['Onboarding.PopQuiz.Title'] })
    expect(quizTitle).toBeInTheDocument()
  })
  test("CSS styles of elements are correct", async () => {
    const mainButton = screen.getByRole('button', { name: English['Onboarding.ThingsToKnow.Button'] })
    const mainButtonStyles = global.getComputedStyle(mainButton)
    expect(rgb2hex(mainButtonStyles.backgroundColor)).toMatch(theme.colors.white)
    expect(rgb2hex(mainButtonStyles.color)).toMatch(theme.colors.primary)
  })
})