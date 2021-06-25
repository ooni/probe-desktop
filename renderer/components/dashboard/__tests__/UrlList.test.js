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
import fs from 'fs-extra'
import path from 'path'
import { testGroups } from '../../nettests'

import UrlList from '../UrlList'

// For Using Intl formatting outside React Hooks
const cache = createIntlCache()
const intl = createIntl({ locale: 'en-US', messages: English }, cache)

// For mocking ConfigProvider and useConfig.js
const ConfigContext = createContext([{}, () => {}])
let mockConfig

const getConfig = async (key = null) => {
  try {
    const configRaw = fs.readFileSync(
      path.join(__dirname, '../../../../ooni_home/config.json')
    )
    mockConfig = JSON.parse(configRaw)
    if (key === null) {
      return mockConfig
    } else {
      return getConfigValue(mockConfig, key)
    }
  } catch (err) {
    console.log('error in func', err)
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

describe('Tests for UrlList.js', () => {
  beforeEach(() => {
    renderComponent(<UrlList incomingList={null} />)
  })
  afterEach(() => {
    cleanup()
  })
  test('Run button is disabled by default', async () => {
    const runButton = screen.getByRole('button', { name: English['Settings.Websites.CustomURL.Run'] })
    expect(runButton).toBeDisabled()
  })
  test('URL is correctly added and a new textbox is created', async () => {
    const urlInputBox = screen.getByRole('textbox')
    expect(urlInputBox).toBeInTheDocument()
    fireEvent.change(urlInputBox, { target: { value: 'https://www.twitter.com' } })
    const addURLButton = screen.getByRole('button', { name: English['Settings.Websites.CustomURL.Add'], bubbles: true })
    fireEvent.click(addURLButton)
    const urlInputBoxes = screen.getAllByRole('textbox')
    expect(urlInputBoxes).toHaveLength(2)
    expect(urlInputBoxes[0].value).toBe('https://www.twitter.com')
    expect(urlInputBoxes[1].value).toBe('')
    const runButton = screen.getByRole('button', { name: English['Settings.Websites.CustomURL.Run'] })
    expect(runButton).toBeDisabled()
  })
})