/* global require */
import React, { useState, useCallback } from 'react'
import { Flex, Container } from 'ooni-components'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import RunTestCard from '../components/home/RunTestCard'
import { DashboardHeader } from '../components/home/DashboardHeader'
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
        <DashboardHeader onRunAll={() => {}}/>
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
