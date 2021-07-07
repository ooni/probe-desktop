/**
 * @jest-environment jsdom
 */

import React from 'react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import English from '../../../../lang/en.json'
import { ipcRenderer } from 'electron'

import Running, { Log, ToggleLogButton } from '../running'

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

describe('Tests for Log component', () => {
  afterEach(() => {
    cleanup()
  })
  test('Log component renders lines correctly', async () => {
    const onToggleLog = jest.fn()
    const logOpen = true
    const logLines = ['Running tests', 'iplookup: using ubuntu', 'sessionresolver: http3://dns.google/dns-query... <nil>']
    renderComponent(<Log lines={logLines} onToggleLog={onToggleLog} open={logOpen} />)
    const logLine1 = screen.getByText(/Running tests/)
    const logLine2 = screen.getByText(/iplookup: using ubuntu/)
    const logLine3 = screen.getByText(/sessionresolver: http3:\/\/dns.google\/dns-query... <nil>/)
    expect(logLine1).toBeInTheDocument()
    expect(logLine2).toBeInTheDocument()
    expect(logLine3).toBeInTheDocument()
  })
})

describe('Tests for ToggleLogButton component', () => {
  afterEach(() => {
    cleanup()
  })
  test('ToggleLogButton shows "Close Log" when is open and triggers callback on click', async () => {
    const open = true
    const onToggleLog = jest.fn()
    renderComponent(<ToggleLogButton onClick={onToggleLog} open={open} />)
    const closeLogButton = screen.getByText(English['Dashboard.Running.CloseLog'])
    const showLogButton = screen.queryByText(English['Dashboard.Running.ShowLog'])
    expect(closeLogButton).toBeInTheDocument()
    expect(showLogButton).not.toBeInTheDocument()
    const toggleLog = screen.getByTestId('toggle-log-button')
    fireEvent.click(toggleLog)
    expect(onToggleLog).toHaveBeenCalledTimes(1)
  })
  test('ToggleLogButton shows "Show Log" when is open and triggers callback on click', async () => {
    const open = false
    const onToggleLog = jest.fn()
    renderComponent(<ToggleLogButton onClick={onToggleLog} open={open} />)
    const showLogButton = screen.getByText(English['Dashboard.Running.ShowLog'])
    const closeLogButton = screen.queryByText(English['Dashboard.Running.CloseLog'])
    expect(showLogButton).toBeInTheDocument()
    expect(closeLogButton).not.toBeInTheDocument()
    const toggeLog = screen.getByTestId('toggle-log-button')
    fireEvent.click(toggeLog)
    expect(onToggleLog).toHaveBeenCalledTimes(1)
  })
})

describe('Tests for "Running" component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('IM test animations load correctly', async () => {
    const testGroupName = 'im'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const animationElement = screen.getByTestId('running-animation-im')
    expect(animationElement).toBeInTheDocument()
  })

  test('Website test animations load correctly', async () => {
    const testGroupName = 'websites'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const animationElement = screen.getByTestId('running-animation-websites')
    expect(animationElement).toBeInTheDocument()
  })

  test('Middleboxes test animations load correctly', async () => {
    const testGroupName = 'middlebox'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const animationElement = screen.getByTestId('running-animation-middlebox')
    expect(animationElement).toBeInTheDocument()
  })

  test('Performance test animations load correctly', async () => {
    const testGroupName = 'performance'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const animationElement = screen.getByTestId('running-animation-performance')
    expect(animationElement).toBeInTheDocument()
  })

  test('Circumvention test animations load correctly', async () => {
    const testGroupName = 'circumvention'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const animationElement = screen.getByTestId('running-animation-circumvention')
    expect(animationElement).toBeInTheDocument()
  })

  test('Default test animations load correctly for non-existing', async () => {
    const testGroupName = 'nonexistent'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const animationElement = screen.getByTestId('running-animation-default')
    expect(animationElement).toBeInTheDocument()
  })

  test('Log message is displayed on receiving log object', async () => {
    const logObj = {
      key: 'log',
      value: '0.48214285714285715% - telegram: measure http://95.161.76.100:443/: <nil>'
    }
    ipcRenderer.on.mockImplementationOnce((event, callback) => {
      callback(event, logObj)
    })
    const testGroupName = 'im'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const toggeLog = screen.getByTestId('toggle-log-button')
    fireEvent.click(toggeLog)
    const logLine = screen.getByText(logObj.value)
    expect(logLine).toBeInTheDocument()
    fireEvent.click(toggeLog)
    expect(logLine).not.toBeInTheDocument()
  })
})
