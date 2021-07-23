import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Label,
  Checkbox,
  Input,
} from 'ooni-components'
import styled from 'styled-components'
import log from 'electron-log'
import { ipcRenderer } from 'electron'

import { useConfig } from './useConfig'
import { FormattedMessage } from 'react-intl'

const StyledLabel = styled(Label)`
  color: ${props => props.disabled ? props.theme.colors.gray6 : 'inherited'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'inherited'};
  & input,select,option {
    color: ${props => props.disabled ? props.theme.colors.gray6 : 'inherited'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'inherited'};
  }
`

const StyledErrorMessage = styled(Box).attrs({
  fontSize: '10px'
})`
  color: ${props => props.theme.colors.red5};
`

export const BooleanOption = ({ label, optionKey, disabled = false, ...rest }) => {
  const [checked, setConfigValue] = useConfig(optionKey)

  const handleChange = useCallback((event) => {
    const target = event.target
    const newValue = Boolean(target.type === 'checkbox' ? target.checked : target.value)

    setConfigValue(newValue)
  }, [setConfigValue])

  return (
    <StyledLabel my={2} disabled={disabled} alignItems='center'>
      <Checkbox
        mr={1}
        className='checkbox'
        data-testid={optionKey}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      />
      {label}
    </StyledLabel>
  )
}

BooleanOption.propTypes = {
  label: PropTypes.element,
  disabled: PropTypes.bool,
  optionKey: PropTypes.string.isRequired
}

export const NumberOption = ({ label, optionKey, disabled = false, ...rest}) => {
  const [configValue, setConfigValue] = useConfig(optionKey)
  const [value, setValue] = useState(configValue)
  const [error, setError] = useState(null)
  const handleChange = useCallback((event) => {
    const target = event.target
    if (target.validity.valid) {
      const newValue = Number(target.value)
      setConfigValue(newValue)
      setError(null)
    } else {
      setError(target.validationMessage)
    }
    setValue(Number(target.value))
  }, [setConfigValue])

  return (
    <StyledLabel my={2} disabled={disabled}>
      <Box width='3em'>
        <Input
          type='number'
          value={value}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
      </Box>
      <Box mx={2}>{label}</Box>
      {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
    </StyledLabel>
  )
}

NumberOption.propTypes = {
  label: PropTypes.element,
  disabled: PropTypes.bool,
  optionKey: PropTypes.string.isRequired
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

// This widget is wired to the pesistent storage in main/utils/store.js
export const AutorunCheckbox = ({ label, optionKey, disabled = false, ...rest }) => {
  const [checked, setChecked] = useState(ipcRenderer.sendSync('prefs.get', optionKey))
  const [busy, setBusy] = useState(false)

  const handleChange = useCallback((event) => {
    setBusy(true)
    const target = event.target
    const newValue = Boolean(target.type === 'checkbox' ? target.checked : target.value)
    if (newValue === true) {
      // Try to enable autorun
      ipcRenderer.invoke('autorun.schedule').then(scheduled => {
        if (scheduled) {
          log.verbose('scheduling successful. updating checkbox UI')
          setChecked(newValue)
        }
      }).finally(() => {
        setBusy(false)
      })
    } else {
      // Try to disable autorun
      ipcRenderer.invoke('autorun.disable').then(success => {
        if (success) {
          log.verbose('Unscheduling successful. updating checkbox UI')
          setChecked(newValue)
        }
      }).finally(() => {
        setBusy(false)
      })
    }

  }, [])

  return (
    <StyledLabel alignItems='center' my={2} disabled={disabled || busy}>
      <Checkbox
        mr={1}
        checked={checked}
        onChange={handleChange}
        disabled={disabled || busy}
        {...rest}
      />
      {label}
    </StyledLabel>
  )
}

AutorunCheckbox.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage)
  ]),
  optionKey: PropTypes.string
}
