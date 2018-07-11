import React from 'react'

import MdChevronRight from 'react-icons/lib/md/chevron-right'

import styled from 'styled-components'

const StyledRightArrow = styled.div`
  cursor: pointer;
  color: ${props => props.theme.colors.gray4};
  &:hover {
    color: ${props => props.theme.colors.gray6};
  }
  &:active {
    color: ${props => props.theme.colors.gray8};
  }
`

const RightArrow = () => (
  <StyledRightArrow>
    <MdChevronRight size={30} />
  </StyledRightArrow>
)

export default RightArrow
