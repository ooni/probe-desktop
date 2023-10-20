import React from 'react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { screen, render, fireEvent } from '@testing-library/react'
import English from '../../../../lang/en.json'
import { ipcRenderer } from 'electron'
import api from '../../../../main/windows/api'

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

Object.defineProperty(window, 'electron', { value: api })

describe('Tests for UrlList.js', () => {
  const websiteList = ['https://www.twitter.com', 'https://www.facebook.com']

  test('Run button is disabled by default', async () => {
    renderComponent(<UrlList incomingList={null} />)
    const runButton = screen.getByTestId('button-run-custom-test')
    expect(runButton).toBeDisabled()
  })

  test('Run button is disabled on entering incorrect URL', async () => {
    renderComponent(<UrlList incomingList={null} />)
    const urlInputBox = screen.getByRole('textbox')
    expect(urlInputBox).toBeInTheDocument()
    fireEvent.change(urlInputBox, {
      target: { value: 'https://www.twitter.c' },
    })
    const runButton = screen.getByTestId('button-run-custom-test')
    expect(runButton).toBeDisabled()
  })

  test('Run button is enabled on entering correct URL', async () => {
    renderComponent(<UrlList incomingList={null} />)
    const urlInputBox = screen.getByRole('textbox')
    expect(urlInputBox).toBeInTheDocument()
    fireEvent.change(urlInputBox, {
      target: { value: websiteList[0] },
    })
    const runButton = screen.getByTestId('button-run-custom-test')
    expect(runButton).not.toBeDisabled()
  })

  test('URL is correctly added and a new textbox is created', async () => {
    renderComponent(<UrlList incomingList={null} />)
    const urlInputBox = screen.getByRole('textbox')
    expect(urlInputBox).toBeInTheDocument()
    fireEvent.change(urlInputBox, {
      target: { value: websiteList[0] },
    })
    const addURLButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Add'],
      bubbles: true,
    })
    fireEvent.click(addURLButton)
    const urlInputBoxes = screen.getAllByRole('textbox')
    expect(urlInputBoxes).toHaveLength(2)
    expect(urlInputBoxes[0].value).toBe(websiteList[0])
    expect(urlInputBoxes[1].value).toBe('')
    const runButton = screen.getByTestId('button-run-custom-test')
    expect(runButton).toBeDisabled()
  })

  test('Added URL can be removed', async () => {
    renderComponent(<UrlList incomingList={null} />)
    const urlInputBox = screen.getByRole('textbox')
    fireEvent.change(urlInputBox, {
      target: { value: websiteList[0] },
    })
    const addURLButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Add'],
      bubbles: true,
    })
    fireEvent.click(addURLButton)
    const newUrlInputBox = screen.getAllByRole('textbox')[1]
    fireEvent.change(newUrlInputBox, {
      target: { value: websiteList[1] },
    })
    const removeFirstURL = screen.getByTestId('urlRemove0')
    const removeSecondURL = screen.getByTestId('urlRemove1')
    fireEvent.click(removeSecondURL)
    expect(removeFirstURL).not.toBeInTheDocument()
    const urlInputBoxes = screen.getAllByRole('textbox')
    expect(urlInputBoxes).toHaveLength(1)
  })

  test('Custom websites test is triggered on entering a valid URL', async () => {
    renderComponent(<UrlList incomingList={null} />)
    const urlInputBox = screen.getByRole('textbox')
    fireEvent.change(urlInputBox, {
      target: { value: websiteList[0] },
    })
    const addURLButton = screen.getByRole('button', {
      name: English['Settings.Websites.CustomURL.Add'],
      bubbles: true,
    })
    fireEvent.click(addURLButton)
    const newUrlInputBox = screen.getAllByRole('textbox')[1]
    fireEvent.change(newUrlInputBox, {
      target: { value: websiteList[1] },
    })
    const runButton = screen.getByTestId('button-run-custom-test')
    expect(runButton).not.toBeDisabled()
    fireEvent.click(runButton)
    expect(ipcRenderer.send).toHaveBeenCalledTimes(1)
    expect(ipcRenderer.send).toHaveBeenCalledWith('fs.write.request', websiteList.join('\n'))
  })
})
