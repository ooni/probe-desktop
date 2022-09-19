import React from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { NettestFacebookMessenger } from 'ooni-components/icons'

import StatusBox from '../../measurement/StatusBox'

const FacebookMessenger = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  let tcpStatus = 'Okay'
  let dnsStatus = 'Okay'

  if (testKeys['facebook_dns_blocking'] === true) {
    dnsStatus = 'Failed'
  }
  if (testKeys['facebook_tcp_blocking'] === true) {
    tcpStatus = 'Failed'
  }

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.InstantMessaging.FacebookMessenger.LikelyBlocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.InstantMessaging.FacebookMessenger.Reachable.Hero.Title' />
  )

  const FBDetails = () => (
    <Box width={1}>
      <Flex my={4}>
        {isAnomaly ? (
          <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.FacebookMessenger.LikelyBlocked.Content.Paragraph' /></Text>
        ) : (
          <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.FacebookMessenger.Reachable.Content.Paragraph' /></Text>
        )}
      </Flex>
      <Flex justifyContent='flex-start' alignItems='center' my={4}>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.InstantMessaging.FacebookMessenger.TCP.Label.Title' />}
            value={<FormattedMessage id={`TestResults.Details.InstantMessaging.FacebookMessenger.TCP.Label.${tcpStatus}`} />}
            ok={tcpStatus !== 'Failed'}
          />
        </Box>

        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.InstantMessaging.FacebookMessenger.DNS.Label.Title' />}
            value={<FormattedMessage id={`TestResults.Details.InstantMessaging.FacebookMessenger.DNS.Label.${dnsStatus}`} />}
            ok={dnsStatus !== 'Failed'}
          />
        </Box>
      </Flex>
    </Box>
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        details: <FBDetails />
      })}
    </div>
  )
}


FacebookMessenger.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { FacebookMessenger }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.FacebookMessenger.Fullname' />,
  icon: <NettestFacebookMessenger />,
  methodology: 'https://ooni.org/nettest/facebook-messenger/'
}
