import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { MdKeyboardArrowLeft } from 'react-icons/md'

const StyledBackLink = styled.a`
  /* Because this button is in the draggable header
     without 'no-drag' the cursor:pointer isn't honored.
     https://www.electronjs.org/docs/api/frameless-window#draggable-region */
  -webkit-app-region: no-drag;
  display: block;
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  &:hover {
    cursor: pointer;
    color: ${props => props.theme.colors.gray4};
  }
  & > svg {
    transform: scaleX(${props => props.theme.isRTL ? -1 : 1});
  }
`

const BackButton = ({ onBack, size = 50 }) => {
  const router = useRouter()
  const routerBack = useCallback(() => {
    router.back()
  }, [router])

  const onClick = onBack || routerBack

  return (
    <StyledBackLink onClick={onClick}>
      <MdKeyboardArrowLeft size={size} />
    </StyledBackLink>
  )
}

BackButton.propTypes = {
  onBack: PropTypes.func,
  size: PropTypes.number
}

export default BackButton
