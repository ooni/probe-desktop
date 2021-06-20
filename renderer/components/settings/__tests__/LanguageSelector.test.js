/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, render, cleanup, fireEvent } from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import English from '../../../../lang/en.json'

import {LanguageSelector} from '../LanguageSelector'

// Mocking useRouter()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/dashboard',
    }
  },
}))

const renderComponent = (component, locale = 'en', messages = English) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>
  )
}

describe('Tests for LanguageSelector component', () => {
  beforeEach(() => {
    renderComponent(<LanguageSelector />)
  })
  afterEach(() => {
    cleanup()
  })
  test('All the Test Cards are mounted', async () => {
    // const label = screen.getByText(English['Settings.Language.Label'])
    // expect(label).toBeInTheDocument()
    const languageSelect = screen.getByLabelText(English['Settings.Language.Label'])
    // fireEvent.click(languageSelect)
    // fireEvent.click(screen.getByText('Spanish'))
    expect(languageSelect).toBeInTheDocument()
  })
})
