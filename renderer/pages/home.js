/* global require */
import React, { useState, useCallback, useEffect } from 'react'
import { Flex, Container } from 'ooni-components'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'
import RunTestCard from '../components/home/RunTestCard'
import { DashboardHeader } from '../components/home/DashboardHeader'
import Running from '../components/home/running'
import { testList, cliTestKeysToGroups } from '../components/nettests'
import TestGroupInDetail from '../components/home/TestGroupInDetail'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.dashboard')

const Home = () => {
  const [testGroupInDetail, showTestGroupDetail] = useState(null)
  const [runningTestGroupName, setRunningTestGroupName] = useState(null)

  const onRun = useCallback((testGroupName) => {
    return () => {
      debug('running', testGroupName)
      setRunningTestGroupName(testGroupName)
      showTestGroupDetail(null)
    }
  }, [setRunningTestGroupName, showTestGroupDetail])

  if (runningTestGroupName !== null) {
    return (
      <Layout>
        <Running testGroupToRun={runningTestGroupName} />
      </Layout>
    )
  } else if (testGroupInDetail !== null) {
    return (
      <Layout>
        <Sidebar>
          <TestGroupInDetail
            testGroup={testGroupInDetail}
            onChooseWebsites={testGroupInDetail === 'websites' ? (
              () => alert('Show Choose Websites UI')
            ) : (
              null
            )}
            onRun={onRun(testGroupInDetail)}
            onBack={() => showTestGroupDetail(null)}
          />
        </Sidebar>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <Sidebar>
          <DashboardHeader onRunAll={onRun('all')}/>
          <Container>
            <Flex flexDirection="column">
              {testList.map((t, idx) => (
                <RunTestCard
                  onClick={() => showTestGroupDetail(t.key)}
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
}

export default Home
