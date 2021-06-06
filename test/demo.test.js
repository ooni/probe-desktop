/**
 * @jest-environment jsdom
 */

import { screen, render } from "@testing-library/react";
import { theme } from "ooni-components";
import { ThemeProvider } from "styled-components";
import { IntlProvider } from "react-intl";
import English from "../lang/en.json";

import Sections from "../renderer/components/onboard/Sections";

const renderWithReactIntl = (component, locale, messages) => {
    return render(
        <IntlProvider locale={locale} messages={messages}>
            { component }
        </IntlProvider>
    );
};

const ThemedComponent = ({ Component }) => {
    return (
        <ThemeProvider theme={theme}>
            <Component />
        </ThemeProvider>
    );
};

describe("Demo block", () => {
    test("Testing if Sections is correctly mounted", async () => {
        renderWithReactIntl(<ThemedComponent Component={ Sections } />, "en", English);
        screen.getByText(/Your app for measuring internet censorship/i);
    });
});
