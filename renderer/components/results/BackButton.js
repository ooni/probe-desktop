import React from 'react'

import { withRouter } from 'next/router'

import styled from 'styled-components'

import MdKeyboardArrowLeft from 'react-icons/lib/md/keyboard-arrow-left'

const StyledBackLink = styled.a`
  cursor: pointer;
  color: ${props => props.theme.colors.white};
  &:hover {
    color: ${props => props.theme.colors.gray4};
  }
`

const BackButton = withRouter(({router}) => {
  return (
    <StyledBackLink onClick={() => router.back()}>
      <MdKeyboardArrowLeft size={50} />
    </StyledBackLink>
  )
})

export default BackButton
