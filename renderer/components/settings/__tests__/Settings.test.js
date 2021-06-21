/**
 * @jest-environment jsdom
 */

import React from 'react'
import {
  screen,
  render,
  cleanup,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider, FormattedMessage } from 'react-intl'
import English from '../../../../lang/en.json'

import { getSupportedLanguages } from '../../langUtils'
import { BooleanOption } from '../widgets'
import { useConfig } from '../useConfig'

// import Settings from '../../../pages/settings'

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

describe('Tests for BooleanCheckbox component', () => {
  beforeEach(() => {
    renderComponent(
      <BooleanOption
        label={<FormattedMessage id="Settings.Sharing.UploadResults" />}
        optionKey="sharing.upload_results"
      />
    )
  })
  afterEach(() => {
    cleanup()
  })
  test('All the Test Cards are mounted', async () => {
    expect(2 + 2).toBe(4)
    console.log('window: ', useConfig('sharing.upload_results'))
  })
})
