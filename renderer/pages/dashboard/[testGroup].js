import React from 'react'
import { useRouter } from 'next/router'

import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import useRunTest from '../../components/dashboard/useRunTest'
import TestGroupInDetail from '../../components/dashboard/TestGroupInDetail'

const DynamicDashboardDetail = () => {
  const router = useRouter()
  const { testGroup } = router.query
  const onRunTest = useRunTest()

  return (
    <Layout>
      <Sidebar>
        <TestGroupInDetail
          testGroup={testGroup}
          onRun={onRunTest(testGroup)}
        />
      </Sidebar>
    </Layout>
  )
}

export default DynamicDashboardDetail
