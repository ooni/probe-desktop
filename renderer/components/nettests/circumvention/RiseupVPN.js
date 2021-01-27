import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'ooni-components'
import { Text } from 'rebass'
import NettestRiseupVPN from './NettestRiseupVPN'
// import { NettestRiseupVPN } from 'ooni-components/dist/icons'

import colorMap from '../../colorMap'
import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'
import StatusBox from '../../measurement/StatusBox'

const Status = ({ count }) => {
  if (typeof count !== 'number' ) {
    return null
  }
  if (count === 0) {
    return <FormattedMessage id='TestResults.Details.Circumvention.RiseupVPN.Reachable.Okay' />
  } else if (count > 1) {
    return <FormattedMessage id='TestResults.Overview.Circumvention.RiseupVPN.Blocked.Plural' values={{ Count: count }} />
  } else {
    return <FormattedMessage id='TestResults.Overview.Circumvention.RiseupVPN.Blocked.Singular' values={{ Count: count}} />
  }
}

const RiseupVPN = ({measurement, isAnomaly, render, rawData}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  let apiStatus = 'Okay'
  let apiLabel = null

  if (testKeys['api_blocked'] || !testKeys['valid_ca_cert']) {
    apiStatus = 'Blocked'
    apiLabel = <FormattedMessage id='TestResults.Overview.Circumvention.RiseupVPN.Api.Blocked' />
  } else {
    apiLabel = <FormattedMessage id='TestResults.Details.Circumvention.RiseupVPN.Reachable.Okay' />
  }

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Circumvention.RiseupVPN.Blocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Circumvention.RiseupVPN.Reachable.Hero.Title' />
  )

  const data = useMemo(() => {
    let openVPNGatewayLabel = null
    let bridgedGatewayLabel = null
    let failedOpenVPNGateways = 0
    let failedBridgeGateways = 0

    if (rawData) {
      const failingGateways = rawData.test_keys.failing_gateways
      if (failingGateways && Array.isArray(failingGateways)) {
        for (const gateway of failingGateways) {
          const { transport_type = '' } = gateway
          if (transport_type === 'openvpn') {
            failedOpenVPNGateways++
          }
          if (transport_type === 'obfs4') {
            failedBridgeGateways++
          }
        }
      }
      return {
        openVPNGatewayLabel,
        bridgedGatewayLabel,
        failedOpenVPNGateways,
        failedBridgeGateways
      }
    }
    return null
  }, [rawData]) /* eslint-disable-line react-hooks/exhaustive-deps */

  const RiseupVPNDetails = () => {
    return(
      <Box width={1}>
        <Flex my={4}>
          <Text>
            {isAnomaly ? (
              <FormattedMarkdownMessage id='TestResults.Details.Circumvention.RiseupVPN.Blocked.Content.Paragraph' />
            ) : (
              <FormattedMarkdownMessage id='TestResults.Details.Circumvention.RiseupVPN.Reachable.Content.Paragraph' />
            )}
          </Text>
        </Flex>
        {data &&
          <Flex justifyContent='flex-start' alignItems='center' my={4}>
            <Box width={1/3}>
              <StatusBox
                label={<FormattedMessage id='TestResults.Details.Circumvention.RiseupVPN.Table.Header.Api' />}
                value={apiLabel}
                ok={apiStatus !== 'Blocked'}
              />
            </Box>
            <Box width={1/3}>
              <StatusBox
                label={<FormattedMessage id='TestResults.Details.Circumvention.RiseupVPN.Table.Header.Openvpn' />}
                value={<Status count={data.failedOpenVPNGateways} />}
                ok={data.failedOpenVPNGateways === 0}
              />
            </Box>
            <Box width={1/3}>
              <StatusBox
                label={<FormattedMessage id='TestResults.Details.Circumvention.RiseupVPN.Table.Header.Bridge' />}
                value={<Status count={data.failedBridgeGateways} />}
                ok={data.failedBridgeGateways === 0}
              />
            </Box>
          </Flex>
        }
      </Box>
    )
  }

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        heroBG: isAnomaly ? colorMap.blocked : colorMap.reachable,
        details: <RiseupVPNDetails />
      })}
    </div>
  )
}

RiseupVPN.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func,
  rawData: PropTypes.object
}

export { RiseupVPN }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.RiseupVPN.Fullname' />,
  icon: <NettestRiseupVPN />,
  methodology: 'https://ooni.org/nettest/riseupvpn/'
}
