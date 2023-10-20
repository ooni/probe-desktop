import React from 'react'

import { screen, render, cleanup, fireEvent } from '../../../../test/unit/utils'

import { ipcRenderer } from 'electron'
import { testGroups } from '../../nettests'
import api from '../../../../main/windows/api'
import Running from '../running'
// Mocking useRouter().push()
const mockRouterPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockRouterPush,
    }
  },
}))

Object.defineProperty(window, 'electron', { value: api })

// scrollIntoView is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn()

describe('Animation tests for "Running" component', () => {
  afterEach(() => {
    cleanup()
  })

  const testGroupNames = ['im', 'websites', 'middlebox', 'performance', 'circumvention']
  testGroupNames.forEach(testGroupName => {
    test(`${testGroupName} test animations load correctly`, async () => {
      const animationData = testGroups[testGroupName].animation
      render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
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
    render(<Running testGroupToRun={testGroupName} inputFile={null} />)
    const toggeLog = screen.getByTestId('toggle-log-button')
    fireEvent.click(toggeLog)
    const logLine = screen.getByText(errorMessage)
    expect(logLine).toBeInTheDocument()
  })
})