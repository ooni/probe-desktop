/**
 * @jest-environment jsdom
 */

import { render, cleanup } from "@testing-library/react";
import { theme } from "ooni-components";
import { ThemeProvider } from "styled-components";
import { IntlProvider } from "react-intl";
import renderer from "react-test-renderer";
import English from "../../../../lang/en.json";

import Stepper from "../Stepper";

const HydratedComponent = (
  { mainComponent },
  locale = "en",
  messages = English
) => {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{mainComponent}</ThemeProvider>
    </IntlProvider>
  );
};

describe("Tests from Stepper component", () => {
  afterEach(() => {
    cleanup();
  });
  test("With active index 0", async () => {
    const component = renderer
      .create(<HydratedComponent mainComponent={`${<Stepper activeIdx={0} />}`} />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
  test("With active index 1", async () => {
    const component = renderer
      .create(<HydratedComponent mainComponent={`${<Stepper activeIdx={1} />}`} />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
  test("With active index 2", async () => {
    const component = renderer
      .create(<HydratedComponent mainComponent={`${<Stepper activeIdx={2} />}`} />)
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
