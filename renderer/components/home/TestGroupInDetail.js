import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Heading, Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import electron from 'electron'
import Raven from 'raven-js'
import moment from 'moment'

import { testGroups } from '../nettests'
import BackButton from '../BackButton'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.results')

const Divider = styled(Box)`
  height: 1px;
  background-color: white;
  width: 100%;
`

const BoldButton = styled(Button)`
  font-weight: bolder;
`

const TestGroupInDetail = ({ onRun, testGroup, onBack, onChooseWebsites }) => {
  const { name, icon, longDescription, color } = testGroups[testGroup]
  const [lastTestedAt, setLastTestedAt] = useState(null)

  useEffect(() => {
    const remote = electron.remote
    const { listResults } = remote.require('./actions')

    listResults().then(results => {
      if (results.hasOwnProperty('rows') && results.rows.length > 0) {
        const filteredRows = results.rows.filter(row => row.name === testGroup)
        const lastTested = filteredRows.length > 0
          ? moment(filteredRows[filteredRows.length - 1].start_time).fromNow()
          : <FormattedMessage id='Dashboard.Overview.LastRun.Never' />
        setLastTestedAt(lastTested)
      }
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.home.testGroupDetail.listResults'}})
      debug('error triggered', err)
    })
  }, [])

  return (
    <Flex flexDirection='column'>
      <Flex bg={color} color='white' py={3}>
        <Box>
          <BackButton onBack={onBack} size={24} />
        </Box>
        <Box>
          {React.cloneElement(icon, {
            size: 96
          })}
        </Box>
        <Box width={1}>
          <Flex flexDirection='column' mx={3}>
            <Flex justifyContent='space-between' alignItems='center'>
              <Heading h={3}>
                {name}
              </Heading>
              <BoldButton inverted onClick={onRun} width={1/5} ml='auto'>
                <FormattedMessage id='Dashboard.Overview.Run' />
              </BoldButton>
              {onChooseWebsites && (
                <BoldButton hollow inverted onClick={onChooseWebsites} ml={3}>
                  <FormattedMessage id='Dashboard.Overview.ChooseWebsites' />
                </BoldButton>
              )}
            </Flex>
            <Divider my={2} />
            <Flex my={2}>
              <Box mr={3}>
                <FormattedMessage id='Dashboard.Overview.Estimated' />
                <strong> ~XXXX MB ~xxxx s </strong>
              </Box>
              <Box mr={3}>
                <FormattedMessage id='Dashboard.Overview.LatestTest' />
                <strong> {lastTestedAt} </strong>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex px={4}>
        {longDescription}
      </Flex>
    </Flex>
  )
}

TestGroupInDetail.propTypes = {
  testGroup: PropTypes.string.isRequired,
  onRun: PropTypes.func,
  onBack: PropTypes.func,
  onChooseWebsites: PropTypes.func
}

export default TestGroupInDetail
