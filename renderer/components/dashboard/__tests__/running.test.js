/**
 * @jest-environment jsdom
 */

import React from 'react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { render, cleanup, screen, fireEvent, within } from '@testing-library/react'
import English from '../../../../lang/en.json'
import { ipcRenderer } from 'electron'
import { testGroups } from '../../nettests'

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
    const logLines = [
      'Running tests',
      'iplookup: using ubuntu',
      'sessionresolver: http3://dns.google/dns-query... <nil>',
    ]
    renderComponent(
      <Log lines={logLines} onToggleLog={onToggleLog} open={logOpen} />
    )
    const logLine1 = screen.getByText(/Running tests/)
    const logLine2 = screen.getByText(/iplookup: using ubuntu/)
    const logLine3 = screen.getByText(
      /sessionresolver: http3:\/\/dns.google\/dns-query... <nil>/
    )
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
    const closeLogButton = screen.getByText(
      English['Dashboard.Running.CloseLog']
    )
    const showLogButton = screen.queryByText(
      English['Dashboard.Running.ShowLog']
    )
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
    const closeLogButton = screen.queryByText(
      English['Dashboard.Running.CloseLog']
    )
    expect(showLogButton).toBeInTheDocument()
    expect(closeLogButton).not.toBeInTheDocument()
    const toggeLog = screen.getByTestId('toggle-log-button')
    fireEvent.click(toggeLog)
    expect(onToggleLog).toHaveBeenCalledTimes(1)
  })
})

describe('Animation tests for "Running" component', () => {
  afterEach(() => {
    cleanup()
  })

  const testGroupNames = ['im', 'websites', 'middlebox', 'performance', 'circumvention']
  testGroupNames.forEach(testGroupName => {
    test(`${testGroupName} test animations load correctly`, async () => {
      const animationData = testGroups[testGroupName].animation
      renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
      const animationElement = screen.getByTestId(`running-animation-${testGroupName}`)
      expect(animationElement).toBeInTheDocument()
      expect(animationElement.firstChild.nodeName).toBe('svg')
      expect(animationElement.firstChild.getAttribute('width')).toBe(animationData.w.toString())
      expect(animationElement.firstChild.getAttribute('height')).toBe(animationData.h.toString())
    })
  })

  test('Default test animations load correctly for non-existing test', async () => {
    const testGroupName = 'nonexistent'
    const animationData = testGroups['default'].animation
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const animationElement = screen.getByTestId('running-animation-default')
    expect(animationElement).toBeInTheDocument()
    expect(animationElement.firstChild.nodeName).toBe('svg')
    expect(animationElement.firstChild.getAttribute('width')).toBe(animationData.w.toString())
    expect(animationElement.firstChild.getAttribute('height')).toBe(animationData.h.toString())
  })
})

describe('IPC tests for "ooni" event in "Running" component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('Component on receiving "ooni.run.progress" for a sample "nettests.Telegram" object', async () => {
    const data = {
      key: 'ooni.run.progress',
      eta: -1,
      message: 'telegram: measure http://95.161.76.100:443/: <nil>',
      percentage: 0.48,
      testKey: 'nettests.Telegram',
    }
    ipcRenderer.on.mockImplementationOnce((event, callback) => {
      callback(event, data)
    })
    const testGroupName = 'im'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const labelTelegram = screen.getByText(/Telegram Test/i)
    const testDetail = screen.getByText(
      'telegram: measure http://95.161.76.100:443/: <nil>'
    )
    expect(labelTelegram).toBeInTheDocument()
    expect(testDetail).toBeInTheDocument()
  })

  test('Component on receiving "ooni.run.progress" for a sample "nettests.WhatsApp" object', async () => {
    const data = {
      key: 'ooni.run.progress',
      eta: -1,
      message: 'whatsapp: measure tcpconnect://e14.whatsapp.net:443: <nil>',
      percentage: 0.55,
      testKey: 'nettests.WhatsApp',
    }
    ipcRenderer.on.mockImplementationOnce((event, callback) => {
      callback(event, data)
    })
    const testGroupName = 'im'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const labelTelegram = screen.getByText(/WhatsApp Test/i)
    const testDetail = screen.getByText(
      'whatsapp: measure tcpconnect://e14.whatsapp.net:443: <nil>'
    )
    expect(labelTelegram).toBeInTheDocument()
    expect(testDetail).toBeInTheDocument()
  })

  test('Log message is displayed on receiving log object', async () => {
    const logObj = {
      key: 'log',
      value:
        '0.48214285714285715% - telegram: measure http://95.161.76.100:443/: <nil>',
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

  test('Error message is displayed on receiving error object', async () => {
    const errorObj = {
      key: 'error',
      message: 'There was an error',
    }
    ipcRenderer.on.mockImplementationOnce((event, callback) => {
      callback(event, errorObj)
    })
    const testGroupName = 'im'
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const errorLine = screen.getByText(errorObj.message)
    expect(errorLine).toBeInTheDocument()
  })
})

describe('IPC tests for other ooniprobe ipc events in "Running" component', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('Displays "Finished running" in log on receiving "ooniprobe.done" event', async () => {
    const testGroupName = 'im'
    ipcRenderer.on.mockImplementation((event, callback) => {
      if (event === 'ooniprobe.done') {
        callback(event, testGroupName)
      }
    })
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const toggeLog = screen.getByTestId('toggle-log-button')
    fireEvent.click(toggeLog)
    const logLine = screen.getByText(`Finished running ${testGroupName}`)
    expect(logLine).toBeInTheDocument()
  })

  test('Directs to /test-results on receiving "ooniprobe.completed" event', async () => {
    const testGroupName = 'im'
    ipcRenderer.on.mockImplementation((event, callback) => {
      if (event === 'ooniprobe.completed') {
        callback(event)
      }
    })
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    expect(mockRouterPush).toHaveBeenCalledWith('/test-results')
  })

  test('Displays error message in log on receiving "ooniprobe.error" event', async () => {
    const testGroupName = 'im'
    const errorMessage = 'Runner: error failed to run im'
    ipcRenderer.on.mockImplementation((event, callback) => {
      if (event === 'ooniprobe.error') {
        callback(event, errorMessage)
      }
    })
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const toggeLog = screen.getByTestId('toggle-log-button')
    fireEvent.click(toggeLog)
    const logLine = screen.getByText(errorMessage)
    expect(logLine).toBeInTheDocument()
  })
})