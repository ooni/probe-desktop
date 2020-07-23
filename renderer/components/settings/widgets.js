import React, { useCallback } from 'react'
import electron from 'electron'
import log from 'electron-log'
import {
  Box,
  Label,
  Checkbox,
  Input,
  Code,
  theme
} from 'ooni-components'
import { FormattedMessage, useIntl } from 'react-intl'

import { getConfigValue } from '../utils'

// TODO: Refactor `handleChange` into a hook like `useConfig` or something

export const BooleanOption = ({ label, optionKey, config, onConfigSet}) => {

  if (config === null) {
    return <div />
  }

  const checked = getConfigValue(config, optionKey)

  const handleChange = useCallback((event) => {

    const remote = electron.remote
    const { setConfig } = remote.require('./utils/config')

    const target = event.target
    const newValue = target.type === 'checkbox' ? target.checked : target.value
    const oldValue = getConfigValue(config, optionKey)
    setConfig(optionKey, oldValue, newValue).then(() => {
      onConfigSet()
    }).catch(() => {
      log.error('inconsistency detected in config')
      onConfigSet()
    })
  }, [onConfigSet, checked])

  return (
    <Label my={2}>
      <Checkbox checked={checked} onChange={handleChange} />
      {label}
    </Label>
  )
}


export const NumberOption = ({ optionKey, config, label, onConfigSet}) => {

  if (config === null) {
    return <div />
  }

  const value = getConfigValue(config, optionKey)

  const handleChange = useCallback((event) => {
    const remote = electron.remote
    const { setConfig } = remote.require('./utils/config')

    const target = event.target
    const newValue = Number(target.value)
    const oldValue = Number(getConfigValue(config, optionKey))
    setConfig(optionKey, oldValue, newValue).then(() => {
      onConfigSet()
    }).catch(() => {
      log.error('inconsistency detected in config')
      onConfigSet()
    })
  }, [value, onConfigSet])

  return (
    <Label my={2}>
      <Box width={1/16}>
        <Input
          type='number'
          min={0}
          max={999}
          value={value}
          onChange={handleChange}
        />
      </Box>
      {label}
    </Label>
  )
}


export const LocaleString = () => {
  const intl = useIntl()
  return (
    <FormattedMessage
      id='Settings.Language.Current'
      values={{ lang:
        <Code
          px={2}
          py={1}
          style={{
            borderRadius: '10px'
          }}
          bg={theme.colors.gray6}
          color='white'
        >
          {intl.locale}
        </Code>
      }}
    />
  )
}
