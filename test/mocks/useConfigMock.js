import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'
import fs from 'fs'
import path from 'path'

const ConfigContext = createContext([{}, () => {}])

let mockConfig

const getConfig = async (key = null) => {
  try {
    const configRaw = fs.readFileSync(
      path.join(__dirname, '../../ooni_home/config.json')
    )
    mockConfig = JSON.parse(configRaw)
    if (key === null) {
      return mockConfig
    } else {
      return getConfigValueMock(mockConfig, key)
    }
  } catch (err) {
    console.log('error in func', err)
    return null
  }
}

const getConfigValueMock = (config, optionKey) =>
  optionKey.split('.').reduce((o, i) => o[i], config)

export const ConfigProvider = (props) => {
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

export const getConfigValue = jest.fn((config, optionKey) =>{
  console.log('config here is: ', config, optionKey)
  optionKey.split('.').reduce((o, i) => o[i], config)
}
)

export const useConfig = jest.fn(() => {
  return [mockConfig]
})
