import React from 'react'
import { Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import { openInBrowser } from '../utils'

const ExplorerURLButton = ({ reportID, input }) => {
  let explorerURL = `https://explorer.ooni.org/measurement/${reportID}`
  if (input) {
    explorerURL = `${explorerURL}?input=${input}`
  }
  return (
    <Button onClick={(e) => openInBrowser(explorerURL, e)}>
      <FormattedMessage id='TestResults.Details.ShowInExplorer' />
    </Button>
  )
}

export default ExplorerURLButton
