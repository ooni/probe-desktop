import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Input, Button } from 'ooni-components'
import { MdRemoveCircle } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

const URLBox = styled(Box)`
  position: relative;
  & label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 8px;
    color: ${props => props.theme.colors.gray5};
    background-color: transparent;
  }
  & button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    padding: 0;
  }
`

const URLInput = styled(Input)`
  background-color: ${props => props.theme.colors.gray1};
  padding-top: 32px;
  padding-left: 8px;
`

const RemoveButton = styled(Button)`
  appearance: none;
  background-color: transparent;
  border: none;
  outline: none;
  color: ${props => props.theme.colors.red3};
  ${URLBox}:hover & {
    background-color: transparent;
    color: ${props => props.theme.colors.red7};
  }
`


const URL = ({ idx, url, error, onUpdate, onRemove, onKeyEnter }) => {
  const [dirty, setDirty] = useState(false)

  const validateURL = useCallback((input) => {
    let hasError = false
    let error = ''
    const protocolRegex = /^(?:http)s?:\/\//i
    // Regular expression to test for valid URLs based on
    // https://github.com/citizenlab/test-lists/blob/master/scripts/lint-lists.py#L18
    const inputRegex = /^(?:http)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[/?]\S+)$/i

    if (input.trim() === '') {
      hasError = true
      error = 'Cannot be empty'
    } else if (!protocolRegex.test(input)) {
      hasError = true
      error = 'Has to start with https:// or http://'
    } else if (!inputRegex.test(input)) {
      hasError = true
      error = 'Not a valid URL format'
    }
    return {
      hasError,
      error
    }
  }, [])

  const onChange = (e) => {
    onUpdate(idx, e.target.value)

    // Also start validting one the field is dirty
    // this lets UrlList to make the Run button active as soon as an error is fixed
    function alsoValidate() {
      const { hasError, error } = validateURL(e.target.value)
      onUpdate(idx, e.target.value, hasError, error)
    }

    dirty && alsoValidate()
  }

  const onDelete = useCallback(() => {
    onRemove(idx)
  }, [idx, onRemove])

  const onKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onKeyEnter(idx)
    }
  }, [idx, onKeyEnter])

  const onBlur = useCallback((e) => {
    if (!dirty) {
      setDirty(true)
    }
    const { hasError, error } = validateURL(e.target.value)
    onUpdate(idx, e.target.value, hasError, error)
  }, [idx, dirty, validateURL, onUpdate])

  return (
    <URLBox my={3}>
      <URLInput
        id={idx}
        name={idx}
        spellCheck={false}
        placeholder='https://'
        value={url || ''}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        error={error}
        data-testid='url-input'
      />
      <label htmlFor={idx}>
        <FormattedMessage id='Settings.Websites.CustomURL.URL' />
      </label>
      {onRemove &&
        <RemoveButton onClick={onDelete} data-testid={`urlRemove${idx}`}>
          <MdRemoveCircle size={32} />
        </RemoveButton>
      }
    </URLBox>
  )
}

URL.propTypes = {
  idx: PropTypes.number.isRequired,
  url: PropTypes.string,
  error: PropTypes.string,
  onKeyEnter: PropTypes.func,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func
}

export default URL
