import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'ooni-components'
import { Text } from 'rebass'
import { NettestTor } from 'ooni-components/dist/icons'

import colorMap from '../../colorMap'
import StatusBox from '../../measurement/StatusBox'


const Tor = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  const {
    or_port_accessible,
    or_port_total,
    or_port_dirauth_accessible,
    or_port_dirauth_total,
    obfs4_accessible,
    obfs4_total,
    dir_port_accessible,
    dir_port_total,
  } = testKeys
  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Circumvention.Tor.Blocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Circumvention.Tor.Reachable.Hero.Title' />
  )

  const TorDetails = () => (
    <Box width={1}>
      <Flex my={4}>
        <Text>
          {isAnomaly ? (
            <FormattedMessage id='TestResults.Details.Circumvention.Tor.Blocked.Content.Paragraph' />
          ) : (
            <FormattedMessage id='TestResults.Details.Circumvention.Tor.Reachable.Content.Paragraph' />
          )}
        </Text>
      </Flex>
      <Flex justifyContent='flex-start' alignItems='center' my={4}>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Circumvention.Tor.BrowserBridges.Label.Title' />}
            value={
              <FormattedMessage
                defaultMessage='{bridgesAccessible}/{bridgesTotal} OK'
                id='TestResults.Details.Circumvention.Tor.BrowserBridges.Label.OK'
                values={{
                  bridgesAccessible: obfs4_accessible,
                  bridgesTotal: obfs4_total
                }}
              />
            }
            color='blue5'
          />
        </Box>

        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Circumvention.Tor.DirectoryAuthorities.Label.Title' />}
            value={
              <FormattedMessage
                defaultMessage='{dirAuthAccessible}/{dirAuthTotal} OK'
                id='TestResults.Details.Circumvention.Tor.DirectoryAuthorities.Label.OK'
                values={{
                  dirAuthAccessible: or_port_dirauth_accessible,
                  dirAuthTotal: or_port_dirauth_total
                }}
              />
            }
            color='blue5'
          />
        </Box>
      </Flex>

    </Box>
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        heroBG: isAnomaly ? colorMap.blocked : colorMap.reachable,
        details: <TorDetails />
      })}
    </div>
  )
}

Tor.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { Tor }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.Tor.Fullname' />,
  icon: <NettestTor />,
  methodology: 'https://ooni.org/nettest/tor'
}
