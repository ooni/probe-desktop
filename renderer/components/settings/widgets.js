import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  // Box,
  // Label,
  Checkbox,
  Input,
} from 'ooni-components'
// import styled from 'styled-components'
import log from 'electron-log/renderer'

import { useConfig } from './useConfig'
import { FormattedMessage } from 'react-intl'

// const StyledLabel = styled(Label)`
//   color: ${props => props.disabled ? props.theme.colors.gray6 : 'inherited'};
//   cursor: ${props => props.disabled ? 'not-allowed' : 'inherited'};
//   & input,select,option {
//     color: ${props => props.disabled ? props.theme.colors.gray6 : 'inherited'};
//     cursor: ${props => props.disabled ? 'not-allowed' : 'inherited'};
//   }
// `

// const StyledErrorMessage = styled(Box).attrs({
//   fontSize: '10px'
// })`
//   color: ${props => props.theme.colors.red5};
// `

export const BooleanOption = ({ label, optionKey, disabled = false, onChange, ...rest }) => {
  const [checked, setConfigValue] = useConfig(optionKey)

  const handleChange = useCallback((event) => {
    const target = event.target
    const newValue = Boolean(target.type === 'checkbox' ? target.checked : target.value)
    if (typeof onChange === 'function') {
      onChange(newValue)
    }

    setConfigValue(newValue)
  }, [setConfigValue, onChange])

  return (
    <Checkbox
      label={label}
      my={2}
      className='checkbox'
      data-testid={optionKey}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      {...rest}
    />
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
    <Input
      label={label}
      type='number'
      value={value}
      onChange={handleChange}
      disabled={disabled}
      error={error}
      {...rest}
    />
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
export const AutorunCheckbox = ({ label, disabled = false, ...rest }) => {
  const [checked, setChecked] = useState(null)
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    window.electron.autorun.status().then(status => {
      setChecked(status)
      setBusy(false)
    })
  }, [])

  const handleChange = useCallback((event) => {
    setBusy(true)
    const target = event.target
    const newValue = Boolean(target.type === 'checkbox' ? target.checked : target.value)
    if (newValue === true) {
      // Try to enable autorun
      window.electron.autorun.schedule().then(scheduled => {
        if (scheduled) {
          log.verbose('scheduling successful. updating checkbox UI')
          setChecked(newValue)
        }
      }).finally(() => {
        setBusy(false)
      })
    } else {
      // Try to disable autorun
      window.electron.autorun.disable().then(success => {
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
    <Checkbox
      my={2}
      label={label}
      checked={checked}
      onChange={handleChange}
      disabled={disabled || busy}
      {...rest}
    />
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
