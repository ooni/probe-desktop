import React from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import StatusBox from '../../measurement/StatusBox'

const Telegram = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  let appStatus = 'Okay'
  let webStatus = 'Okay'

  if (testKeys['telegram_http_blocking'] === true || testKeys['telegram_tcp_blocking'] === true) {
    appStatus = 'Failed'
  }
  if (testKeys['telegram_web_blocking'] === true) {
    webStatus = 'Failed'
  }

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.InstantMessaging.Telegram.LikelyBlocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.InstantMessaging.Telegram.Reachable.Hero.Title' />
  )

  const TelegramDetails = () => (
    <Box width={1}>
      <Flex my={4}>
        {isAnomaly ? (
          <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.Telegram.LikelyBlocked.Content.Paragraph' /></Text>
        ) : (
          <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.Telegram.Reachable.Content.Paragraph' /></Text>
        )}
      </Flex>
      <Flex justifyContent='flex-start' alignItems='center' my={4}>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.InstantMessaging.Telegram.Application.Label.Title' />}
            value={<FormattedMessage id={`TestResults.Details.InstantMessaging.Telegram.Application.Label.${appStatus}`} />}
            ok={appStatus !== 'Failed'}
          />
        </Box>

        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.InstantMessaging.Telegram.WebApp.Label.Title' />}
            value={<FormattedMessage id={`TestResults.Details.InstantMessaging.Telegram.WebApp.Label.${webStatus}`} />}
            ok={webStatus !== 'Failed'}
          />
        </Box>
      </Flex>
    </Box>
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        details: <TelegramDetails />

      })}
    </div>
  )
}


Telegram.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { Telegram }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.Telegram.Fullname' />
}
