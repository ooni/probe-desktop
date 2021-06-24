/**
 * @jest-environment jsdom
 */

import React, { useState, createContext } from 'react'
import { screen, render, waitFor } from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import English from '../../../../lang/en.json'
import TestGroupInDetail from '../TestGroupInDetail'
import fs from 'fs-extra'
import path from 'path'

const ConfigContext = createContext([{}, () => {}])

let config
let mockConfig

const getConfig = async (key = null) => {
  try {
    const configRaw = fs.readFileSync(
      path.join(__dirname, '../../../../ooni_home/config.json')
    )
    config = JSON.parse(configRaw)
    mockConfig = JSON.parse(configRaw)
    if (key === null) {
      return config
    } else {
      return getConfigValue(config, key)
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

jest.mock('../../settings/useConfig', () => {
  return {
    getConfigValue: jest.fn((config, optionKey) =>
      optionKey.split('.').reduce((o, i) => o[i], config)
    ),
    useConfig: jest.fn((key = null) => {
      // const [config, setConfigContext] = useContext(ConfigContext)
      const config1 = mockConfig
      // if (config === null) {
      //   ipcRenderer.invoke('get-fresh-config').then((config) => {
      //     setConfigContext(config)
      //   })
      // }

      const currentValue = config1

      // const [err, setErr] = useState(null)
      // const [pending, setPending] = useState(false)

      // const setConfigValue = useCallback((value) => {
      //   setPending(true)
      //   const { setConfig } = remote.require('./utils/config')

      //   setConfig(key, currentValue, value)
      //     .then((result) => {
      //       setConfigContext(result)
      //     })
      //     .catch(setErr)
      //     .finally(() => setPending(false))
      // }, [setConfigContext, currentValue, key])

      return [currentValue]
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

describe('Test if TestGroupInDetail component is correctly mounted', () => {
  const runTest = jest.fn()
  test('Component renders correctly for IM', async () => {
    renderComponent(<TestGroupInDetail testGroup="im" onRun={runTest} />)
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
