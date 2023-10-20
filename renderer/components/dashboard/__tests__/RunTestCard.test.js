import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import { theme } from 'ooni-components'

import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import English from '../../../../lang/en.json'
import { useRouter } from 'next/router'

import RunTestCard from '../RunTestCard'
import { testList } from '../../nettests'

// Mocking useRouter()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/dashboard',
      push: mockPush
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

describe('Tests for RunTestCard component', () => {
  const router = useRouter()

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Individual Test Cards work as expected', async () => {
    const websiteDetails = testList[0]
    renderComponent(
      <RunTestCard
        onClick={() =>
          router.push('/dashboard/[testGroup]', `/dashboard/${websiteDetails.key}`)
        }
        id={websiteDetails.key}
        {...websiteDetails}
      />
    )

    const testCard = screen.getByTestId(`run-card-${websiteDetails.key}`)
    fireEvent.click(testCard)
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/[testGroup]', `/dashboard/${websiteDetails.key}`)
  })
})
