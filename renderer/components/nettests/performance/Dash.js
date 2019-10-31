import React from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import StatusBox from '../../measurement/StatusBox'
import formatBitrate from '../../formatBitrate'
import formatSpeed from '../../formatSpeed'
import performanceTestGroup from './index'

const Dash = ({measurement, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  const {
    connect_latency,
    median_bitrate,
    min_playout_delay
  } = testKeys

  // Get human readable description of the bitrate (e.g 4k, FHD, 240p)
  const optimalQuality = formatBitrate(median_bitrate)
  const bitrate = formatSpeed(median_bitrate)

  const DashHero = (
    <Box width={1} p={3}>
      <Flex flexWrap='wrap' my={4} alignItems='center'>
        <Box my={3}>
          <FormattedMessage
            id='TestResults.Details.Performance.Dash.VideoWithoutBuffering'
            values={{
              VideoQuality: optimalQuality
            }}
          />
        </Box>
      </Flex>
    </Box>
  )

  const DashTitle = (
    <FormattedMessage
      id='TestResults.Details.Performance.Dash.VideoWithoutBuffering'
      values={{
        VideoQuality: optimalQuality
      }}
    />
  )

  const DashDetails = () => (
    <Box width={1}>
      <Flex flexWrap='wrap' alignItems='center' my={4}>
        <Box width={1/2} my={4}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.Dash.MedianBitrate' />}
            value={<Text>{bitrate.value} <small>{bitrate.unit}</small></Text>}
          />
        </Box>
        <Box width={1/2}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.Dash.PlayoutDelay' />}
            value={min_playout_delay}
          />
        </Box>
      </Flex>
    </Box>
  )

  return (
    <div>
      {render({
        heroIcon: <div />,
        heroBG: performanceTestGroup.color,
        heroTitle: optimalQuality,
        heroSubtitle: DashTitle,
        details: <DashDetails />

      })}
    </div>
  )
}


Dash.propTypes = {
  measurement: PropTypes.object,
  render: PropTypes.func
}

export { Dash }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.Dash.Fullname' />,
  methodology: 'https://ooni.org/nettest/dash/'
}
