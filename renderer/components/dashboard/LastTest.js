import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Text, Box } from 'ooni-components'
import { useIntl, FormattedMessage, FormattedRelativeTime } from 'react-intl'

const LastTest = ({ testGroupName, ...rest }) => {
  const intl = useIntl()
  const fallback = intl.formatMessage({ id: 'Dashboard.Overview.LastRun.Never' })
  const [lastTestTime, setLastTestTime] = useState(null)
  const onLastResultResponse = useCallback((data) => {
    const { lastResult } = data
    if (lastResult) {
      const diffInSeconds = (new Date(lastResult) - new Date()) / 1000
      setLastTestTime(diffInSeconds)
    }
  }, [])

  useEffect(() => {
    window.electron.results.last.request(testGroupName)
    const removeResponseListeners = window.electron.results.last.response(onLastResultResponse)

    return () => {
      removeResponseListeners()
    }
  }, [testGroupName, onLastResultResponse])

  return (
    <Box {...rest}>
      <Text as='span' mr={1}>
        <FormattedMessage id='Dashboard.Overview.LatestTest' />
      </Text> {
        lastTestTime ?
          <FormattedRelativeTime value={lastTestTime} updateIntervalInSeconds={600} /> : 
          fallback
      }
    </Box>
  )
}

LastTest.propTypes = {
  testGroupName: PropTypes.string.isRequired
}

export default LastTest
