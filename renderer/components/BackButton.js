import React from 'react'

import { useRouter } from 'next/router'

import styled from 'styled-components'
import { MdKeyboardArrowLeft } from 'react-icons/md'

const StyledBackLink = styled.a`
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.gray4};
  }
`

const BackButton = (() => {
  const router = useRouter()
  return (
    <StyledBackLink onClick={() => router.back()}>
      <MdKeyboardArrowLeft size={50} />
    </StyledBackLink>
  )
})

export default BackButton
