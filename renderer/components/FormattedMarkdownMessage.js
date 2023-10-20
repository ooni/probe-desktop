import React from 'react'
import { useIntl } from 'react-intl'
import Markdown from 'markdown-to-jsx'

import ExternalLink from './ExternalLink'

const FormattedMarkdownMessage = ({ id, defaultMessage, values, description }) => {
  
  const { formatMessage } = useIntl()
  const messageDescriptor = { id, defaultMessage, description }
  const message = formatMessage(messageDescriptor, values)

  return (
    <Markdown
      options={{
        overrides: {
          a: {
            component: ExternalLink,
          },
        }
      }}
    >
      {message}
    </Markdown>
  )
}

export default FormattedMarkdownMessage
