import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Text } from 'ooni-components'
import { NettestPsiphon } from 'ooni-components/icons'

import colorMap from '../../colorMap'
import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'

const Psiphon = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.Blocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.Reachable.Hero.Title' />
  )

  const PsiphonDetails = () => (
    <Box width={1}>
      <Flex my={4}>
        {isAnomaly ? (
          <FormattedMarkdownMessage id='TestResults.Details.Circumvention.Psiphon.Blocked.Content.Paragraph' />
        ) : (
          <FormattedMarkdownMessage id='TestResults.Details.Circumvention.Psiphon.Reachable.Content.Paragraph' />
        )}
      </Flex>
      {
        testKeys['bootstrap_time'] &&
        <Flex my={4} flexDirection='column'>
          <Box>
            <FormattedMessage id='TestResults.Details.Circumvention.Psiphon.BootstrapTime.Label.Title' />
          </Box>
          <Box>
            <Text color='blue5' fontSize={3}>
              <FormattedMessage
                id='TestResults.Details.Circumvention.Psiphon.BootstrapTime.Unit'
                values={{
                  seconds: testKeys['bootstrap_time'].toFixed(2)
                }}
              />
            </Text>
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
