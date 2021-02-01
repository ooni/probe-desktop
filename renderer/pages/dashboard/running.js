/* global require */
import React from 'react'
import { useRouter } from 'next/router'

import Layout from 'components/Layout'
import Running from 'components/dashboard/running'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.dashboard.running')

const RunningTest = () => {
  const router = useRouter()
  const { runningTestGroupName, inputFile } = router.query

  debug('running', runningTestGroupName)

  return (
    <Layout>
      <Running
        testGroupToRun={runningTestGroupName}
        inputFile={inputFile}
      />
    </Layout>
  )
}

export default RunningTest
