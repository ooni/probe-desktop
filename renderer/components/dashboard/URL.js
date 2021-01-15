import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Box, Input } from 'ooni-components'
import { MdDelete } from 'react-icons/md'

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
    right: 0;
    top: 0;
    bottom: 0;
  }
`

const URLInput = styled(Input)`
  background-color: ${props => props.theme.colors.white};
  padding-top: 32px;
  padding-left: 8px;
`

const URL = ({ idx, url, onUpdate, onRemove }) => {
  const onChange = useCallback((e) => {
    onUpdate(idx, e.target.value)
  }, [])
  const onDelete = useCallback((e) => {
    onRemove(idx)
  }, [])


  return (
    <URLBox my={2}>
      <URLInput
        id={idx}
        name={idx}
        placeholder='https://'
        value={url}
        onChange={onChange}
      />
      <label htmlFor={idx}>URL</label>
      <button onClick={onDelete}><MdDelete size={24} /></button>
    </URLBox>
  )
}

export default URL
