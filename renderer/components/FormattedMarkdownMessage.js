import React from 'react'

import PropTypes from 'prop-types'

import remark from 'remark'
import reactRenderer from 'remark-react'

class FormattedMarkdownMessage extends React.Component {
  render() {
    const { formatMessage } = this.context.intl
    const { id, defaultMessage, values, description } = this.props
    const messageDescriptor = { id, defaultMessage, values, description }
    const message = formatMessage(messageDescriptor)
    // When the message is the ID means it's not defined and we just emit not
    // element
    if (message === id) {
      return null
    }
    return remark().use(reactRenderer).processSync(message).contents
  }
}

FormattedMarkdownMessage.contextTypes = {
  intl: PropTypes.object.isRequired
}

export default FormattedMarkdownMessage
