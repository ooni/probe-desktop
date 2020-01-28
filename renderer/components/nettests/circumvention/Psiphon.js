import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box } from 'ooni-components'
import { Text } from 'rebass'
import { NettestPsiphon } from 'ooni-components/dist/icons'

import colorMap from '../../colorMap'

const Psiphon = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.Blocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.Reachable.Hero.Title' />
  )

  const PsiphonDetails = () => (
    <Box width={1}>
      <Flex my={4} justifyContent='center'>
        <Text>
          {isAnomaly ? (
            <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.Blocked.Content.Paragraph' />
          ) : (
            <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.Reachable.Content.Paragraph' />
          )}
        </Text>
      </Flex>
      {
        testKeys['bootstrap_time'] !== null &&
        <Flex my={4} flexDirection='column'>
          <Box>
            <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.BootstrapTime.Label.Title' />
          </Box>
          <Box>
            <Text is='span' color='blue5' fontSize={3}>{testKeys['bootstrap_time'].toFixed(2)}</Text>
            {' '}
            <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.BootstrapTime.Unit' />
          </Box>
        </Flex>
      }
    </Box>
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        heroBG: isAnomaly ? colorMap.blocked : colorMap.reachable,
        details: <PsiphonDetails />
      })}
    </div>
  )
}

Psiphon.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { Psiphon }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.Psiphon.Fullname' />,
  icon: <NettestPsiphon />,
  methodology: 'https://ooni.org/nettest/psiphon/'
}
