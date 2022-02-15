import React from 'react'
import {render} from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import enStrings from '../../lang/en.json'

const AllTheProviders = ({children}) => {
  return (
    <IntlProvider locale='en' messages={enStrings}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </IntlProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, {wrapper: AllTheProviders, ...options})

// re-export everything
export * from '@testing-library/react'

// override render method
export {customRender as render}