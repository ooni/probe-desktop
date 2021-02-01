import React, { useCallback } from 'react'
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

const URL = ({ idx, url, onUpdate, onRemove, onKeyEnter }) => {
  const onChange = useCallback((e) => {
    onUpdate(idx, e.target.value)
  }, [onUpdate])
  const onDelete = useCallback(() => {
    onRemove(idx)
  }, [onRemove])
  const onKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      onKeyEnter(idx)
    }
  }, [onKeyEnter])

  return (
    <URLBox my={3}>
      <URLInput
        id={idx}
        name={idx}
        placeholder='https://'
        value={url}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      <label htmlFor={idx}>
        <FormattedMessage id='Settings.Websites.CustomURL.URL' />
      </label>
      {onRemove &&
        <RemoveButton onClick={onDelete}>
          <MdRemoveCircle size={32} />
        </RemoveButton>
      }
    </URLBox>
  )
}

URL.propTypes = {
  idx: PropTypes.number.isRequired,
  url: PropTypes.string,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func
}

export default URL
