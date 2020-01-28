import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'ooni-components'
import styled from 'styled-components'

import { openInBrowser } from './utils'

const StyledLink = styled(Link)`
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.gray3};
  }
`

const ExternalLink = ({href, color = 'blue5', children}) => {
  return (
    <StyledLink color={color} href={href} onClick={(e) => openInBrowser(href, e)}>
      {children}
    </StyledLink>
  )
}

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  color: PropTypes.string,
  children: PropTypes.node
}

export default ExternalLink
