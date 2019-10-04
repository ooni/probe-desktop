import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Text } from 'ooni-components'

import FullHeightFlex from '../../FullHeightFlex'
import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

const WebConnectivity = ({measurement, isAnomaly, render}) => {

  const { url } = measurement

  const WebDetails = () => (
    <FullHeightFlex>
      <Box>
        <Flex my={3} flexDirection='column'>
          {isAnomaly ? (
            <Box>
              <FormattedMessage
                id='TestResults.Details.Websites.Reachable.Content.Paragraph'
                values={{
                  WebsiteURL: url
                }}
              />
            </Box>
          ) : (
            <Box>
              <FormattedMarkdownMessage
                id='TestResults.Details.Websites.LikelyBlocked.Content.Paragraph'
                values={{
                  WebsiteURL: url,
                  BlockingReason: 'DNS'
                }}
              />
            </Box>
          )}
        </Flex>
      </Box>
    </FullHeightFlex>
  )

  return (
    <div>
      {render({
        heroBG: 'green8', // TODO: (sarathms) Determine color based on presence of anomaly
        details: <WebDetails />
      })}
    </div>
  )
}

export { WebConnectivity }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.WebConnectivity.Fullname' />
}
