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

const WhatsApp = ({measurement, isAnomaly, render}) => {
  // {"registration_server_blocking":false,"whatsapp_web_blocking":false,"whatsapp_endpoints_blocking":false}
  const testKeys = JSON.parse(measurement.test_keys)
  let appStatus = 'Okay'
  let webStatus = 'Okay'
  let registrationStatus = 'Okay'

  if (testKeys['whatsapp_endpoints_blocking'] === true) {
    appStatus = 'Failed'
  }
  if (testKeys['whatsapp_web_blocking'] === true) {
    webStatus = 'Failed'
  }
  if (testKeys['registration_server_blocking'] === true) {
    registrationStatus = 'Failed'
  }

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.InstantMessaging.WhatsApp.LikelyBlocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.InstantMessaging.WhatsApp.Reachable.Hero.Title' />
  )

  const TelegramDetails = () => (
    <Box width={1}>
      <Flex my={4}>
        {isAnomaly ? (
          <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.WhatsApp.LikelyBlocked.Content.Paragraph' /></Text>
        ) : (
          <Text center><FormattedMessage id='TestResults.Details.InstantMessaging.WhatsApp.Reachable.Content.Paragraph' /></Text>
        )}
      </Flex>
      <Flex justifyContent='flex-start' alignItems='center' my={4}>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.InstantMessaging.WhatsApp.Application.Label.Title' />}
            value={<FormattedMessage id={`TestResults.Details.InstantMessaging.WhatsApp.Application.Label.${appStatus}`} />}
            ok={appStatus !== 'Failed'}
          />
        </Box>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.InstantMessaging.WhatsApp.WebApp.Label.Title' />}
            value={<FormattedMessage id={`TestResults.Details.InstantMessaging.WhatsApp.WebApp.Label.${webStatus}`} />}
            ok={webStatus !== 'Failed'}
          />
        </Box>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.InstantMessaging.WhatsApp.Registrations.Label.Title' />}
            value={<FormattedMessage id={`TestResults.Details.InstantMessaging.WhatsApp.Registrations.Label.${registrationStatus}`} />}
            ok={registrationStatus !== 'Failed'}
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


WhatsApp.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { WhatsApp }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.WhatsApp.Fullname' />
}
