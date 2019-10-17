import React from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import StatusBox from '../../measurement/StatusBox'
import formatSpeed from '../../formatSpeed'
import performanceTestGroup from './index'

const NDT = ({measurement, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  const {
    download,
    upload,
    ping,
    server = 'Not in test_keys',
    avg_rtt,
    mss
  } = testKeys
  const downloadSpeed = formatSpeed(download)
  const uploadSpeed = formatSpeed(upload)
  const NDTHero = (
    <Box width={1}>
      <Flex flexWrap='wrap' mx={4} my={4} alignItems='center'>
        <Box width={1/2} my={3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.Download' />}
            value={<Text>{downloadSpeed.value} <small>{downloadSpeed.unit}</small></Text>}
            ok={true}
          />
        </Box>
        <Box width={1/2}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.Upload' />}
            value={<Text>{uploadSpeed.value} <small>{uploadSpeed.unit}</small></Text>}
            ok={true}
          />
        </Box>
        <Box width={1/2}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.Ping' />}
            value={<Text>{ping} <small>ms</small></Text>}
            ok={true}
          />
        </Box>
        <Box width={1/2}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.Server' />}
            value={<Text>server</Text>}
            ok={true}
          />
        </Box>
      </Flex>
    </Box>
  )

  const NDTetails = () => (
    <Box width={1}>
      <Flex flexWrap='wrap' alignItems='center' my={4}>
        <Box width={1/2} my={4}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.AveragePing' />}
            value={avg_rtt}
          />
        </Box>
        <Box width={1/2}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.MSS' />}
            value={mss}
          />
        </Box>
      </Flex>
    </Box>
  )

  return (
    <div>
      {render({
        hero: NDTHero,
        heroBG: performanceTestGroup.color,
        details: <NDTetails />
      })}
    </div>
  )
}


NDT.propTypes = {
  measurement: PropTypes.object,
  render: PropTypes.func
}

export { NDT }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.NDT.Fullname' />
}
