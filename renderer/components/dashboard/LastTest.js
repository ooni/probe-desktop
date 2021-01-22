import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'
import { Text, Box } from 'ooni-components'
import { useIntl, FormattedMessage } from 'react-intl'
import moment from 'moment'

import { lastResultRequest, lastResultResponse } from '../../../main/ipcBindings'

const LastTest = ({ testGroupName, ...rest }) => {
  const intl = useIntl()
  const [lastTestTime, setLastTestTime] = useState(null)
  const onLastResultResponse = useCallback((event, data) => {
    const { lastResult } = data
    const fallback = intl.formatMessage({ id: 'Dashboard.Overview.LastRun.Never' })

    if (lastResult) {
      setLastTestTime(moment(lastResult).fromNow(false))
    } else {
      setLastTestTime(fallback)
    }
  }, [intl])

  useEffect(() => {
    ipcRenderer.send(lastResultRequest, { testGroupName })

    ipcRenderer.on(lastResultResponse, onLastResultResponse)
    return () => {
      ipcRenderer.removeAllListeners(lastResultResponse)
    }
  }, [onLastResultResponse])

  return (
    <Box color='black' {...rest}>
      <Text as='span' mr={1}>
        <FormattedMessage id='Dashboard.Overview.LatestTest' />
      </Text> {lastTestTime}
    </Box>
  )
}

LastTest.propTypes = {
  testGroupName: PropTypes.string.isRequired
}

export default LastTest
