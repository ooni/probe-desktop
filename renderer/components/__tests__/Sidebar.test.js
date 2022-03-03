/**
 * @jest-environment jsdom
 */

import React from 'react'
import { screen, render, fireEvent } from '../../../test/unit/utils'

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

const renderSidebar = () => render(<Sidebar><></></Sidebar>)

describe('Tests for Sidebar component', () => {
  test('Displays the correct version', async () => {
    renderSidebar()
    const versionNumber = screen.getByTestId('sidebar-version-number')
    expect(versionNumber.innerHTML).toMatch(version)
  })

  test('Clicking on Dashboard NavItem calls pushes router to /dashboard', async () => {
    renderSidebar()
    const navItemDashboard = screen.getByTestId('sidebar-item-dashboard')
    fireEvent.click(navItemDashboard)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/dashboard')
  })

  test('Clicking on Test Results NavItem calls pushes router to /test-results', async () => {
    renderSidebar()
    const navItemTestResults = screen.getByTestId('sidebar-item-test-results')
    fireEvent.click(navItemTestResults)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/test-results')
  })

  test('Clicking on Settings NavItem calls pushes router to /settings', async () => {
    renderSidebar()
    const navItemSettings = screen.getByTestId('sidebar-item-settings')
    fireEvent.click(navItemSettings)

    expect(mockRouterPush).toHaveBeenLastCalledWith('/settings')
  })
})
