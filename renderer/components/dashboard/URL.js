import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Box, Input } from 'ooni-components'

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
`

const URLInput = styled(Input)`
  background-color: ${props => props.theme.colors.white};
  padding-top: 32px;
  padding-left: 8px;
`

const URL = ({ idx, url, onUpdate }) => {
  const onChange = useCallback((e) => {
    onUpdate(idx, e.target.value)
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
    </URLBox>
  )
}

export default URL
