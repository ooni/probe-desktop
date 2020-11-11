/* global require */
import React, { useState, useCallback } from 'react'
import { Text, Flex, Container } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import RunTestCard from '../components/home/RunTestCard'
import RunAllButton from '../components/home/RunAllButton'
import { DashboardHeader, DashboardHeaderBG } from '../components/home/DashboardHeader'
import Running from '../components/home/running'
import { testList } from '../components/nettests'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.dashboard')


const Home = () => {
  const [runningTestGroupName, setRunningTestGroupName] = useState(null)

  const onRun = useCallback((testGroupName) => {
    return () => {
      debug('running', testGroupName)
      setRunningTestGroupName(testGroupName)
    }
  }, [setRunningTestGroupName])

  if (runningTestGroupName !== null) {
    return (
      <Layout>
        <Running testGroupName={runningTestGroupName} />
      </Layout>
    )
  }

  return (
    <Layout>
      <Sidebar>
        <DashboardHeader mb={5}>
          <DashboardHeaderBG />
          <RunAllButton inverted fontSize={2}>
            <Text fontWeight='bold'>
              <FormattedMessage id='Dashboard.Overview.Run' />
            </Text>
          </RunAllButton>
        </DashboardHeader>
        <Container>
          <Flex flexDirection="column">
            {testList.map((t, idx) => (
              <RunTestCard
                onRun={onRun(t.key)}
                key={idx}
                id={t.key}
                {...t}
              />
            ))}
          </Flex>
        </Container>
      </Sidebar>
    </Layout>
  )
}

export default Home
