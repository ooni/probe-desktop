import React from 'react'

import { FormattedMessage } from 'react-intl'

import ExternalLink from '../ExternalLink'

const MethodologyButton = ({ href }) => (
  <ExternalLink href={href} >
    <FormattedMessage id='TestResults.Details.Methodology' />
  </ExternalLink>
)

export default MethodologyButton
