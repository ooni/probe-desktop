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

import { useConfig } from './useConfig'

export const BooleanOption = ({ label, optionKey }) => {
  const [checked, setConfigValue] = useConfig(optionKey)

  const handleChange = useCallback((event) => {
    const target = event.target
    const newValue = target.type === 'checkbox' ? target.checked : target.value

    setConfigValue(newValue)
  }, [setConfigValue])

  return (
    <Label my={2}>
      <Checkbox checked={checked} onChange={handleChange} />
      {label}
    </Label>
  )
}


export const NumberOption = ({ label, optionKey}) => {
  const [value, setConfigValue] = useConfig(optionKey)

  const handleChange = useCallback((event) => {
    const target = event.target
    const newValue = Number(target.value)
    setConfigValue(newValue)
  }, [setConfigValue])

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

export const ListOption = ({ optionKey, children }) => {
  const [list, setListValue] = useConfig(optionKey)
  const handleChange = useCallback((event) => {
    const code = event.target.name
    if (event.target.checked === true) {
      if (list.indexOf(code) === -1) {
        const newList = [...list, code].sort()
        setListValue(newList)
      }
    } else {
      if (list.indexOf(code) > -1) {
        const newList = list.filter(item => item !== code)
        setListValue(newList)
      }
    }
  }, [list, setListValue])
  return children(JSON.stringify(list), handleChange)
}
