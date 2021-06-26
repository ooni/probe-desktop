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
  test('Added URL can be removed', async () => {
    const urlInputBox = screen.getByRole('textbox')
    fireEvent.change(urlInputBox, {
      target: { value: 'https://www.twitter.com' },
    })
    const addURLButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Add'],
      bubbles: true,
    })
    fireEvent.click(addURLButton)
    const newUrlInputBox = screen.getAllByRole('textbox')[1]
    fireEvent.change(newUrlInputBox, {
      target: { value: 'https://www.facebook.com' },
    })
    const removeFirstURL = screen.getByTestId('urlRemove0')
    const removeSecondURL = screen.getByTestId('urlRemove1')
    fireEvent.click(removeSecondURL)
    expect(removeFirstURL).not.toBeInTheDocument()
    const urlInputBoxes = screen.getAllByRole('textbox')
    expect(urlInputBoxes).toHaveLength(1)
  })

  // There is some buggy behavior with Run button as it doesn't enable on entering correct URLs

  test('Custom websites test is triggered on entering a valid URL', async () => {
    const urlInputBox = screen.getByRole('textbox')
    fireEvent.change(urlInputBox, {
      target: { value: 'https://www.twitter.com' },
    })
    fireEvent.keyDown(urlInputBox, {
      key: 'Tab',
      code: 9,
      charCode: 9
    })
    // const addURLButton = screen.getByRole('button', {
    //   name: English['Settings.Websites.CustomURL.Add'],
    //   bubbles: true,
    // })
    // fireEvent.click(addURLButton)
    // const newUrlInputBox = screen.getAllByRole('textbox')[1]
    // console.log('prev line')
    // fireEvent.change(newUrlInputBox, {
    //   target: { value: 'https://www.facebook.com' },
    // })
    // fireEvent.click(addURLButton)

    // const removeThirdUrlInput = screen.getByTestId('urlRemove2')
    // fireEvent.click(removeThirdUrlInput)
    const runButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Run'],
    })
    expect(runButton).not.toBeDisabled()
    fireEvent.click(runButton)
    expect(mockRouterPush).toHaveBeenCalledWith('/dashboard/running')
    expect(2).toBe(2)
  })
})
