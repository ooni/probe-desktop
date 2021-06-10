/**
 * @jest-environment jsdom
 */

import { screen, render, fireEvent, findByText, findByRole, cleanup } from "@testing-library/react";
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
  test("Loads the next page", async () => {
    renderComponent(<Sections />);
    const gotItButton = screen.getByRole('button', { name: English['Onboarding.WhatIsOONIProbe.GotIt'] })
    fireEvent.click(gotItButton)
    const page2Title = await screen.findByRole('heading', { name: English['Onboarding.ThingsToKnow.Title'] })
    expect(page2Title).toBeInTheDocument()
  });
  //  test("Sections is correctly mounted", async () => {
  //      screen.getByText(/Your app for measuring internet censorship/i);
  //      const gotItButton = screen.getByRole('button', { name: /Got it/i })
  //      fireEvent.click(gotItButton)
  //      const headsUp = await screen.findByText(/Heads-Up/i)
  //      expect(headsUp).toBeInTheDocument()
  //     // renderComponent(<HeadsUp />)
  //  });
  //  test("I understand", async () => {
  //     // screen.getByText(/I understand/i);
  //     console.log(English['General.AppName'])
  // //     const gotItButton = screen.getByRole('button', { name: /Got it/i })
  // //     fireEvent.click(gotItButton)
  // //     const headsUp = await screen.findByText(/Heads-Up/i)
  // //     expect(headsUp).toBeInTheDocument()
  // //    // renderComponent(<HeadsUp />)
  // });
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
  test("Screen 2 renders correctly", async () => {
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
})
