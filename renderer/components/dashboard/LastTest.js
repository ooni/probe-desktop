import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'
import { Text, Box } from 'ooni-components'
import { useIntl, FormattedMessage, FormattedRelativeTime } from 'react-intl'

const lastResultRequest = 'results.last.request'
const lastResultResponse = 'results.last.response'

const LastTest = ({ testGroupName, ...rest }) => {
  const intl = useIntl()
  const fallback = intl.formatMessage({ id: 'Dashboard.Overview.LastRun.Never' })
  const [lastTestTime, setLastTestTime] = useState(fallback)
  const onLastResultResponse = useCallback((event, data) => {
    const { lastResult } = data
    if (lastResult) {
      const diffInSeconds = (new Date(lastResult) - new Date()) / 1000
      setLastTestTime(diffInSeconds)
    }
  }, [])

  useEffect(() => {
    ipcRenderer.send(lastResultRequest, { testGroupName })

    ipcRenderer.on(lastResultResponse, onLastResultResponse)
    return () => {
      ipcRenderer.removeAllListeners(lastResultResponse)
    }
  }, [testGroupName, onLastResultResponse])

  return (
    <Box {...rest}>
      <Text as='span' mr={1}>
        <FormattedMessage id='Dashboard.Overview.LatestTest' />
      </Text> <FormattedRelativeTime value={lastTestTime} updateIntervalInSeconds={600} />
    </Box>
  )
}

LastTest.propTypes = {
  testGroupName: PropTypes.string.isRequired
}

export default LastTest
