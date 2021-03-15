import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import NettestSignal from './NettestSignal'
// import { NettestSignal } from 'ooni-components/dist/icons'

const Signal = ({ measurement, isAnomaly, render }) => {

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.InstantMessaging.Signal.LikelyBlocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.InstantMessaging.Signal.Reachable.Hero.Title' />
  )


  const SignalDetails = () => (
    <Box>
      {isAnomaly ? (
        <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.Signal.LikelyBlocked.Content.Paragraph' /></Text>
      ) : (
        <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.Signal.Reachable.Content.Paragraph' /></Text>
      )}
    </Box>
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        details: <SignalDetails />
      })}
    </div>
  )
}
Signal.propTypes = {
  isAnomaly: PropTypes.bool,
  measurement: PropTypes.shape({
    test_keys: PropTypes.string
  }),
  render: PropTypes.func
}

export { Signal }

export default {
  name: <FormattedMessage id='Test.Signal.Fullname' />,
  icon: <NettestSignal />,
  methodology: 'https://ooni.org/nettest/signal/'
}