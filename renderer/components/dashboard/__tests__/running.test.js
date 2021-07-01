/**
 * @jest-environment jsdom
 */

import React from 'react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { screen, render, fireEvent, cleanup } from '@testing-library/react'
import English from '../../../../lang/en.json'
import { testList, cliTestKeysToGroups, testGroups } from '../../nettests'

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

const renderComponent = (component, locale = 'en', messages = English) => {
  return render(
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </IntlProvider>
  )
}

describe('Tests for UrlList.js', () => {
  afterEach(() => {
    cleanup()
  })

  test('Runs', async () => {
    const testGroupName = 'im'
    const testGroup = testGroups[testGroupName in testGroups ? testGroupName : 'default']
    console.log('testGroup: ', testGroup)
    renderComponent(<Running testGroupToRun={testGroupName} inputFile={null} />)
    expect(2).toBe(2)
  })
})
