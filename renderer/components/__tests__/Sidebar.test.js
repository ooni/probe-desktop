/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, render, cleanup, fireEvent } from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import English from '../../../lang/en.json'

import Sidebar from '../Sidebar'
import { version } from '../../../package.json'

// Mocking useRouter()
const mockRouterPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/dashboard',
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

describe('Tests for Sidebar component', () => {
  afterEach(() => {
    cleanup()
  })

  test('Displays the correct version', async () => {
    renderComponent(
      <Sidebar>
        <></>
      </Sidebar>
    )
    const versionNumber = screen.getByTestId('sidebar-version-number')
    expect(versionNumber.innerHTML).toMatch(version)
  })

  test('Displays child elements', async () => {
    renderComponent(
      <Sidebar>
        <p data-testid="test-paragraph">Test paragraph</p>
      </Sidebar>
    )
    expect(screen.getByTestId('test-paragraph').innerHTML).toBe(
      'Test paragraph'
    )
  })

})


describe('Sidebar NavItems push the router to correct path', () => {
  beforeEach(() => {
    renderComponent(
      <Sidebar>
        <></>
      </Sidebar>
    )
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('Clicking on Dashboard NavItem calls pushes router to /dashboard', async () => {
    const navItemDashboard = screen.getByTestId('sidebar-item-dashboard')
    fireEvent.click(navItemDashboard)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/dashboard')
  })

  test('Clicking on Test Results NavItem calls pushes router to /test-results', async () => {
    const navItemTestResults = screen.getByTestId('sidebar-item-test-results')
    fireEvent.click(navItemTestResults)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/test-results')
  })

  test('Clicking on Settings NavItem calls pushes router to /settings', async () => {
    const navItemSettings= screen.getByTestId('sidebar-item-settings')
    fireEvent.click(navItemSettings)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/settings')
  })

})