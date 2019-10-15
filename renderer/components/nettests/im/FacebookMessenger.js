import React from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import { colorMap } from '../../measurement/MeasurementContainer'

const StatusBox = ({label, value, ok}) => (
  <Flex flexWrap='wrap'>
    <Box width={1}>
      <Text fontSize={1}>{label}</Text>
    </Box>
    <Box width={1}>
      <Text fontSize={3} fontWeight={300} color={ok ? 'unset' : colorMap.anomaly}>{value}</Text>
    </Box>
  </Flex>
)

StatusBox.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  ok: PropTypes.bool.isRequired
}

const FacebookMessenger = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  // summary = { "DNSBlocking": false, "TCPBlocking": false, "Blocked": false }
  let blockingReason = ''
  let tcpStatus = 'Okay'
  let dnsStatus = 'Okay'

  if (testKeys['facebook_dns_blocking'] === true && testKeys['facebook_tcp_blocking'] === true) {
    blockingReason = 'DNSandTCPIP'
    tcpStatus = 'Failed'
    dnsStatus = 'Failed'
  } else if (testKeys['facebook_dns_blocking'] === true) {
    blockingReason = 'DNSOnly'
    dnsStatus = 'Failed'
  } else if (testKeys['facebook_tcp_blocking'] === true) {
    blockingReason = 'TCPIPOnly'
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
  name: <FormattedMessage id='Test.FacebookMessenger.Fullname' />
}
