/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, render, cleanup, fireEvent } from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import IntlProvider from '../../IntlProvider'
import English from '../../../../lang/en.json'
import Spanish from '../../../../lang/es.json'
import { LanguageSelector } from '../LanguageSelector'

const renderComponent = (component, locale = 'en', messages = English) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>
  )
}

describe('Tests for LanguageSelector component', () => {
  beforeAll(() => {
    // Loading translations in the window object
    const OONITranslations = {
      en: English,
      es: Spanish,
    }
    window.OONITranslations = OONITranslations
  })
  beforeEach(() => {
    renderComponent(<LanguageSelector />)
  })
  afterEach(() => {
    cleanup()
  })
  test('All the Test Cards are mounted', async () => {
    const label = screen.getByText(English['Settings.Language.Label'])
    expect(label).toBeInTheDocument()
    // const languageSelect = screen.getByRole('combobox')
    // fireEvent.change(languageSelect, { target: { value: 'en' } })
    // console.log('val: ', languageSelect.value)
  })
})
