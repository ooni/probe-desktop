/* global require */
import React from 'react'

import PropTypes from 'prop-types'

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

class FormattedMarkdownMessage extends React.Component {
  render() {
    const { formatMessage } = this.context.intl
    const { id, defaultMessage, values, description } = this.props
    const messageDescriptor = { id, defaultMessage, description }
    const message = formatMessage(messageDescriptor, values)
    // When the message is the ID means it's not defined and we just emit not
    // element
    if (message === id) {
      return null
    }
    return remark().use(reactRenderer, {remarkReactComponents}).processSync(message).contents
  }
}

FormattedMarkdownMessage.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default FormattedMarkdownMessage
