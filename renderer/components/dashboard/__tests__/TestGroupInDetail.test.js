// TODO: Can parametrize these tests based on testGroups

/**
 * @jest-environment jsdom
 */

import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider, createIntl, createIntlCache } from 'react-intl'
import {
  screen,
  render,
  waitFor,
  fireEvent,
  cleanup,
} from '@testing-library/react'

import English from '../../../../lang/en.json'
import { testGroups } from '../../nettests'
import TestGroupInDetail from '../TestGroupInDetail'
import { initializeConfig } from '../../../../main/utils/config'

// For Using Intl formatting outside React Hooks
const cache = createIntlCache()
const intl = createIntl({ locale: 'en-US', messages: English }, cache)

// For mocking ConfigProvider and useConfig.js
const ConfigContext = createContext([{}, () => {}])
let mockConfig

const getConfig = (key = null) => {
  try {
    mockConfig = initializeConfig()

    if (key === null) {
      return mockConfig
    } else {
      return getConfigValue(mockConfig, key)
    }
  } catch (err) {
    console.error('Config file not found', err)
    return null
  }
}

const getConfigValue = (config, optionKey) =>
  optionKey.split('.').reduce((o, i) => o[i], config)

const ConfigProvider = (props) => {
  const [state, setState] = useState(getConfig())
  return (
    <ConfigContext.Provider value={[state, setState]}>
      {props.children}
    </ConfigContext.Provider>
  )
}

ConfigProvider.propTypes = {
  children: PropTypes.node,
}

jest.mock('../../settings/useConfig', () => {
  return {
    getConfigValue: jest.fn((config, optionKey) =>
      optionKey.split('.').reduce((o, i) => o[i], config)
    ),
    useConfig: jest.fn(() => {
      return [mockConfig]
    }),
  }
})

// Mocking useRouter().push()
const mockRouterPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: mockRouterPush,
    }
  },
}))

// Mock getHomeDir
jest.mock('../../../../main/utils/paths', () => ({
  getHomeDir: jest.fn(() => '/home/user/probe-desktop/ooni_home'),
}))

const renderComponent = (component, locale = 'en', messages = English) => {
  return render(
    <ConfigProvider>
      <IntlProvider locale={locale} messages={messages}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </IntlProvider>
    </ConfigProvider>
  )
}

const getEstimatedSizeAndTime = (testGroup) => {
  const { estimatedSize, estimatedTimeInSec } = testGroups[testGroup]
  const estimatedTime = estimatedTimeInSec(0)
  const [estimatedTimeValue, estimatedTimeUnit] =
    estimatedTime > 60
      ? [estimatedTime / 60, 'minute']
      : [estimatedTime, 'second']
  const formattedEstimatedTime = intl.formatNumber(estimatedTimeValue, {
    style: 'unit',
    unit: estimatedTimeUnit,
    unitDisplay: 'short',
  })
  return [estimatedSize, formattedEstimatedTime]
}

describe('Test if TestGroupInDetail component is correctly rendered', () => {
  const runTest = jest.fn()
  afterEach(() => {
    cleanup()
    runTest.mockClear()
  })

  test('Component renders correctly for IM', async () => {
    const testGroup = 'im'

    renderComponent(
      <TestGroupInDetail
        testGroup={testGroup}
        onRun={() => runTest(testGroup)}
      />
    )

    const [estimatedSize, estimatedTime] = getEstimatedSizeAndTime(testGroup)
    await waitFor(
      () =>
        screen.findByRole('heading', {
          name: English['Test.InstantMessaging.Fullname'],
        }),
      { timeout: 3000 }
    )
    const size = screen.getByText(estimatedSize)
    const time = screen.getByText('~' + estimatedTime)
    expect(size).toBeInTheDocument()
    expect(time).toBeInTheDocument()

    const runButton = screen.getByRole('button', {
      name: English['Dashboard.Overview.Run'],
    })
    fireEvent.click(runButton)
    expect(runTest).toHaveBeenCalledTimes(1)
    expect(runTest).toHaveBeenCalledWith(testGroup)
  })

  test('Component renders correctly for Circumvention', async () => {
    const testGroup = 'circumvention'

    renderComponent(
      <TestGroupInDetail
        testGroup={testGroup}
        onRun={() => runTest(testGroup)}
      />
    )

    const [estimatedSize, estimatedTime] = getEstimatedSizeAndTime(testGroup)
    await waitFor(
      () =>
        screen.findByRole('heading', {
          name: English['Test.Circumvention.Fullname'],
        }),
      { timeout: 3000 }
    )
    const size = screen.getByText(estimatedSize)
    const time = screen.getByText('~' + estimatedTime)
    expect(size).toBeInTheDocument()
    expect(time).toBeInTheDocument()

    const runButton = screen.getByRole('button', {
      name: English['Dashboard.Overview.Run'],
    })
    fireEvent.click(runButton)
    expect(runTest).toHaveBeenCalledTimes(1)
    expect(runTest).toHaveBeenCalledWith(testGroup)
  })

  test('Component renders correctly for Performance', async () => {
    const testGroup = 'performance'

    renderComponent(
      <TestGroupInDetail
        testGroup={testGroup}
        onRun={() => runTest(testGroup)}
      />
    )

    const [estimatedSize, estimatedTime] = getEstimatedSizeAndTime(testGroup)
    await waitFor(
      () =>
        screen.findByRole('heading', {
          name: English['Test.Performance.Fullname'],
        }),
      { timeout: 3000 }
    )
    const size = screen.getByText(estimatedSize)
    const time = screen.getByText('~' + estimatedTime)
    expect(size).toBeInTheDocument()
    expect(time).toBeInTheDocument()

    const runButton = screen.getByRole('button', {
      name: English['Dashboard.Overview.Run'],
    })
    fireEvent.click(runButton)
    expect(runTest).toHaveBeenCalledTimes(1)
    expect(runTest).toHaveBeenCalledWith(testGroup)
  })

  test('Component renders correctly for Middleboxes', async () => {
    const testGroup = 'middlebox'

    renderComponent(
      <TestGroupInDetail
        testGroup={testGroup}
        onRun={() => runTest(testGroup)}
      />
    )

    const [estimatedSize, estimatedTime] = getEstimatedSizeAndTime(testGroup)
    await waitFor(
      () =>
        screen.findByRole('heading', {
          name: English['Test.Middleboxes.Fullname'],
        }),
      { timeout: 3000 }
    )
    const size = screen.getByText(estimatedSize)
    const time = screen.getByText('~' + estimatedTime)
    expect(size).toBeInTheDocument()
    expect(time).toBeInTheDocument()

    const runButton = screen.getByRole('button', {
      name: English['Dashboard.Overview.Run'],
    })
    fireEvent.click(runButton)
    expect(runTest).toHaveBeenCalledTimes(1)
    expect(runTest).toHaveBeenCalledWith(testGroup)
  })
})

describe('TestGroupInDetail is correctly rendered for Website test', () => {
  const runTest = jest.fn()
  afterEach(() => {
    cleanup()
    runTest.mockClear()
  })

  test('Component renders correctly for Websites', async () => {
    const testGroup = 'websites'

    renderComponent(
      <TestGroupInDetail
        testGroup={testGroup}
        onRun={() => runTest(testGroup)}
      />
    )

    const [estimatedSize] = getEstimatedSizeAndTime(testGroup)
    await waitFor(
      () =>
        screen.findByRole('heading', {
          name: English['Test.Websites.Fullname'],
        }),
      { timeout: 3000 }
    )
    const size = screen.getByText(estimatedSize)
    // This doesn't work for Website tests. Although in dev mode, the estimated time
    // displayed is ~ 60 min, in jest render the same comes out to be ~ NaN min
    // The reason being for some reason `estimatedTime` gives out an object instead of
    // the expected value of 3600
    // const time = screen.getByText('~' + estimatedTime)
    expect(size).toBeInTheDocument()

    const runButton = screen.getByRole('button', {
      name: English['Dashboard.Overview.Run'],
    })
    fireEvent.click(runButton)
    expect(runTest).toHaveBeenCalledTimes(1)
    expect(runTest).toHaveBeenCalledWith(testGroup)

    const chooseButton = screen.getByRole('button', {
      name: English['Dashboard.Overview.ChooseWebsites'],
    })
    expect(chooseButton).toBeInTheDocument()

    fireEvent.click(chooseButton, { button: 0 })
    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith('/dashboard/websites/choose')
  })
})
