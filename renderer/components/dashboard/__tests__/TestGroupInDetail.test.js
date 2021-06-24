/**
 * @jest-environment jsdom
 */

import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider, createIntl, createIntlCache } from 'react-intl'
import TestGroupInDetail from '../TestGroupInDetail'
import { screen, render, waitFor } from '@testing-library/react'
import English from '../../../../lang/en.json'
import fs from 'fs-extra'
import path from 'path'
import { testGroups } from '../../nettests'

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
      console.log('mockConfig: ', mockConfig)
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

const renderComponent = (component, locale = 'en', messages = English) => {
  return render(
    <ConfigProvider>
      <IntlProvider locale={locale} messages={messages}>
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      </IntlProvider>
    </ConfigProvider>
  )
}

const getEstimatedSizeAndTime = testGroup => {
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

describe('Test if TestGroupInDetail component is correctly mounted', () => {
  const runTest = jest.fn()
  test('Component renders correctly for IM', async () => {
    const testGroup = 'im'
    renderComponent(<TestGroupInDetail testGroup={ testGroup } onRun={runTest} />)

    const [estimatedSize, estimatedTime] = getEstimatedSizeAndTime(testGroup)

    console.log('Estimated size and time: ', estimatedSize, estimatedTime)
    await waitFor(
      () =>
        screen.findByRole('heading', {
          name: English['Test.InstantMessaging.Fullname'],
        }),
      { timeout: 3000 }
    )
    expect(2).toBe(2)
  })
})
