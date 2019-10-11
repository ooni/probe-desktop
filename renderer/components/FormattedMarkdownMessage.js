/* global require */
import React from 'react'

import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import remark from 'remark'
import reactRenderer from 'remark-react'

const StyledLink = styled.a`

color: ${props => props.theme.colors.blue5};
text-decoration: none;

&:hover {
  color: ${props => props.theme.colors.blue3};
}
`

const openInBrowser = (url, event) => {
  var shell = require('electron').shell
  event.preventDefault()
  shell.openExternal(url)
}

const OpenLinkInBrowser = ({href, children}) => {
  return (
    <StyledLink href={href} onClick={(e) => openInBrowser(href, e)}>
      {children}
    </StyledLink>
  )
}

const remarkReactComponents = {
  a: OpenLinkInBrowser
}

const FormattedMarkdownMessage = ({ id, defaultMessage, values, description }) => {
  const { formatMessage } = useIntl()
  const messageDescriptor = { id, defaultMessage, description }
  const message = formatMessage(messageDescriptor, values)

  return remark().use(reactRenderer, {remarkReactComponents}).processSync(message).contents
}

export default FormattedMarkdownMessage
