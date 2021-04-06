import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Flex,
  Box,
  Text
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import * as Sentry from '@sentry/electron'
import log from 'electron-log'

import StatusBox from '../../measurement/StatusBox'
import formatSpeed from '../../formatSpeed'
import performanceTestGroup from './index'
import { useRawData } from '../../useRawData'

const NDT = ({measurement, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)
  const {
    download,
    upload,
    ping,
    avg_rtt,
    mss
  } = testKeys

  const downloadSpeed = formatSpeed(download)
  const uploadSpeed = formatSpeed(upload)

  const { rawData } = useRawData()

  const server = useMemo(() => {
    try {
      if (rawData) {
        if (rawData.test_keys.server.hostname) {
          return rawData.test_keys.server.hostname
        }
      } else {
        return null
      }
    } catch (e) {
      log.error(`error in retrieving NDT server hostname for measurement. ${e}`)
      Sentry.captureException(e)
    }
  }, [rawData])

  const NDTTitle = (
    <Box width={1}>
      <Flex flexWrap='wrap' alignItems='center'>
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
      </Flex>
    </Box>
  )

  const NDTdetails = () => (
    <Box width={1}>
      <Flex alignItems='center' my={4}>
        <Box width={1/2}>
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
      <Flex alignItems='center' my={4}>
        <Box width={1/2}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Performance.NDT.Ping' />}
            value={<Text>{ping} <small>ms</small></Text>}
            ok={true}
          />
        </Box>
        {server && (
          <Box width={1/2}>
            <StatusBox
              label={<FormattedMessage id='TestResults.Details.Performance.NDT.Server' />}
              value={<Text>{server}</Text>}
              ok={true}
            />
          </Box>
        )}
      </Flex>
    </Box>
  )

  return (
    <div>
      {render({
        heroIcon: <div />,
        heroBG: performanceTestGroup.color,
        heroTitle: NDTTitle,
        heroSubtitle: null,
        details: <NDTdetails />
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
  name: <FormattedMessage id='Test.NDT.Fullname' />,
  methodology: 'https://ooni.org/nettest/ndt/'
}
