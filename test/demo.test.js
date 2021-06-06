/**
 * @jest-environment jsdom
 */

import "jest-styled-components";
import { screen, render } from "@testing-library/react";
import { theme } from "ooni-components";
import { ThemeProvider } from "styled-components";
import { IntlProvider } from "react-intl";
import English from "../lang/en.json";

import Sections from "../renderer/components/onboard/Sections";

const renderWithReactIntl = (component, locale, messages) => {
    return render(
        <IntlProvider locale={locale} messages={messages}>
            {component}
        </IntlProvider>
    );
};

const Component1 = () => {
    return (
        <ThemeProvider theme={theme}>
            <Sections />
        </ThemeProvider>
    );
};

describe("Demo block", () => {
    test("random", async () => {
        // expect(2+2).toBe(4)
        renderWithReactIntl(<Component1 />, "en", English);
        screen.getByText(/Your app for measuring internet censorshidsfsdfp/i);
        // expect(2+2).toBe(3)
    });
});
