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

// {
//   "upload": 13167.668687352241,
//   "download": 71491.99053672275,
//   "ping": 9,
//   "max_rtt": 0,
//   "avg_rtt": 0,
//   "min_rtt": 9,
//   "mss": 0,
//   "out_of_order": 0,
//   "packet_loss": 0,
//   "timeouts": 0
// }

const NDT = ({measurement, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  const {
    download,
    upload,
    ping,
    server = 'Not in test_keys',
    packet_loss,
    out_of_order,
    avg_rtt,
    max_rtt,
    mss,
    timeouts
  } = testKeys
  const downloadSpeed = formatSpeed(download)
  const uploadSpeed = formatSpeed(upload)
  const NDTHero = (
    <Box width={1} p={3}>
      <Flex flexWrap='wrap' my={4} alignItems='center'>
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
        <Box width={1/3} my={4}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.PacketLoss' />}
            value={<Text>{packet_loss} <small> % </small></Text>}
          />
        </Box>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.OutOfOrder' />}
            value={out_of_order}
          />
        </Box>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.AveragePing' />}
            value={avg_rtt}
          />
        </Box>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.MaxPing' />}
            value={max_rtt}
          />
        </Box>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.MSS' />}
            value={mss}
          />
        </Box>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.Timeouts' />}
            value={timeouts}
          />
        </Box>
      </Flex>
    </Box>
  )

  return (
    <div>
      {render({
        hero: NDTHero,
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
