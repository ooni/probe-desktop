/**
 * @jest-environment jsdom
 */

import React from 'react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { screen, render, fireEvent, cleanup } from '@testing-library/react'
import English from '../../../../lang/en.json'

import UrlList from '../UrlList'

// Mocking useRouter().push()
const mockRouterPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockRouterPush,
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

describe('Tests for UrlList.js', () => {
  beforeEach(() => {
    renderComponent(<UrlList incomingList={null} />)
  })
  afterEach(() => {
    cleanup()
  })
  test('Run button is disabled by default', async () => {
    const runButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Run'],
    })
    expect(runButton).toBeDisabled()
  })
  test('URL is correctly added and a new textbox is created', async () => {
    const urlInputBox = screen.getByRole('textbox')
    expect(urlInputBox).toBeInTheDocument()
    fireEvent.change(urlInputBox, {
      target: { value: 'https://www.twitter.com' },
    })
    const addURLButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Add'],
      bubbles: true,
    })
    fireEvent.click(addURLButton)
    const urlInputBoxes = screen.getAllByRole('textbox')
    expect(urlInputBoxes).toHaveLength(2)
    expect(urlInputBoxes[0].value).toBe('https://www.twitter.com')
    expect(urlInputBoxes[1].value).toBe('')
    const runButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Run'],
    })
    expect(runButton).toBeDisabled()
  })
})
