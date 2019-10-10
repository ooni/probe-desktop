import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Flex, Box, Text } from 'ooni-components'

import FullHeightFlex from '../../FullHeightFlex'
import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

const WebConnectivity = ({measurement, isAnomaly, render}) => {

  const intl = useIntl()
  const { url, test_keys } = measurement
  const testKeys = JSON.parse(test_keys)

  let blockingReason = '' // TODO: a reasonable default for "...by means of ___"
  switch (testKeys.blocking) {
  case 'tcp_ip':
    blockingReason = intl.formatMessage({ id: 'TestResults.Details.Websites.LikelyBlocked.BlockingReason.TCPIP' })
    break
  case 'dns':
    blockingReason = intl.formatMessage({ id: 'TestResults.Details.Websites.LikelyBlocked.BlockingReason.DNS' })
    break
  case 'http-diff':
    blockingReason = intl.formatMessage({ id: 'TestResults.Details.Websites.LikelyBlocked.BlockingReason.HTTPDiff' })
    break
  case 'http-failure':
    blockingReason = intl.formatMessage({ id: 'TestResults.Details.Websites.LikelyBlocked.BlockingReason.HTTPFailure' })
    break
  }

  const WebDetails = () => (
    <FullHeightFlex>
      <Box>
        <Flex my={3} flexDirection='column'>
          {isAnomaly ? (
            <Box>
              <FormattedMarkdownMessage
                id='TestResults.Details.Websites.LikelyBlocked.Content.Paragraph'
                values={{
                  WebsiteURL: url,
                  BlockingReason: blockingReason
                }}
              />
            </Box>
          ) : (
            <Box>
              <FormattedMessage
                id='TestResults.Details.Websites.Reachable.Content.Paragraph'
                values={{
                  WebsiteURL: url
                }}
              />
            </Box>
          )}
        </Flex>
      </Box>
    </FullHeightFlex>
  )

  const heroSubtitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Websites.LikelyBlocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Websites.Reachable.Hero.Title' />
  )

  return (
    <div>
      {render({
        heroTitle: url,
        heroSubtitle: heroSubtitle,
        details: <WebDetails isAnomaly={isAnomaly} />
      })}
    </div>
  )
}

WebConnectivity.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { WebConnectivity }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.WebConnectivity.Fullname' />
}
