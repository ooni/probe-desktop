import React from 'react'

import { MdChevronRight } from 'react-icons/md'

import styled from 'styled-components'

const RightArrow = styled(MdChevronRight)`
  cursor: pointer;
  color: ${props => props.theme.colors.gray4};
  &:hover {
    color: ${props => props.theme.colors.gray6};
  }
  &:active {
    color: ${props => props.theme.colors.gray8};
  }
`

RightArrow.defaultProps = {
  size: 30
}

export default RightArrow
