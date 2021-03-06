import React from 'react'
import PropTypes from 'prop-types'

import { MdOpenInNew } from 'react-icons/md'

import { Link } from 'ooni-components'

import { openInBrowser } from './utils'

const ExternalLink = ({href, color = 'blue5', children, ...props}) => (
  <Link {...props} color={color} href={href} onClick={(e) => openInBrowser(href  , e)}>
    {children}
    <MdOpenInNew />
  </Link>
)

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  color: PropTypes.string,
  children: PropTypes.node
}

export default ExternalLink
