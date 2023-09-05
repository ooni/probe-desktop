import React from 'react'
import { useIntl } from 'react-intl'
// import remark from 'remark'
// import reactRenderer from 'remark-react'

// import ExternalLink from './ExternalLink'

// const remarkReactComponents = {
//   a: ExternalLink
// }

const FormattedMarkdownMessage = ({ id, defaultMessage, values, description }) => {
  const { formatMessage } = useIntl()
  const messageDescriptor = { id, defaultMessage, description }
  const message = formatMessage(messageDescriptor, values)
  return <>FIX MARKDOWN</>
  // return remark().use(reactRenderer, {remarkReactComponents}).processSync(message).contents
}

export default FormattedMarkdownMessage
