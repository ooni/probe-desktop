import React from 'react'
import { Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import { openInBrowser } from '../utils'

const MethodologyButton = ({ href }) => (
  <Button hollow onClick={(e) => openInBrowser(href, e)}>
    <FormattedMessage id='TestResults.Details.Methodology' />
  </Button>
)

export default MethodologyButton
