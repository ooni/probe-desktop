import React from 'react'

import { screen, render, cleanup, fireEvent } from '../../../../test/unit/utils'
import English from '../../../../lang/en.json'
import { Logs, ToggleLogButton } from '../Logs'

// scrollIntoView is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn()

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
    render(
      <Logs lines={logLines} onToggleLog={onToggleLog} open={logOpen} />
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
    render(<ToggleLogButton onClick={onToggleLog} open={open} />)
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
    render(<ToggleLogButton onClick={onToggleLog} open={open} />)
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