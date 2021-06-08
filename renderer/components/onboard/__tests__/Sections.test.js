/**
 * @jest-environment jsdom
 */

 import { screen, render } from "@testing-library/react";
 import { theme } from "ooni-components";
 import { ThemeProvider } from "styled-components";
 import { IntlProvider } from "react-intl";
 import English from "../../../../lang/en.json";
 
 import Sections from "../Sections";
 
 const renderComponent = (component, locale, messages) => {
     return render(
         <IntlProvider locale={locale} messages={messages}>
             <ThemeProvider theme={theme}>
                 { component }
             </ThemeProvider>
         </IntlProvider>
     );
 };
 
 describe("Rendering Sections", () => {
     test("Sections is correctly mounted", async () => {
         renderComponent(<Sections />, "en", English);
         screen.getByText(/Your app for measuring internet censorship/i);
     });
 });
 