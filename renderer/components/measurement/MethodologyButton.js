import React from 'react'

import { FormattedMessage } from 'react-intl'

import ExternalLink from '../ExternalLink'

const MethodologyButton = ({ href, ...props }) => (
  <ExternalLink href={href} {...props}>
    <FormattedMessage id='TestResults.Details.Methodology' />
  </ExternalLink>
)

export default MethodologyButton
