import React from 'react'
import styled from 'styled-components'
import { Button } from 'ooni-components'

const RunAllButton = styled(Button).attrs({
  width: 2/5,
  fontSize: 3
})`
  box-shadow: 0px 4px 8px 1px ${props => props.theme.colors.gray7};
  border: 1px solid ${props => props.theme.colors.gray3};
  border-radius: 16px;
  position: relative;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`

export default RunAllButton
