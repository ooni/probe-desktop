import React from 'react'
import { useRouter } from 'next/router'

import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import useRunTest from '../../components/dashboard/useRunTest'
import TestGroupInDetail from '../../components/dashboard/TestGroupInDetail'

export async function getStaticPaths() {
  return {
    paths: [
      { params: { testGroup: 'websites' } },
      { params: { testGroup: 'im' } },
      { params: { testGroup: 'circumvention' } },
      { params: { testGroup: 'performance' } },
      { params: { testGroup: 'middlebox' } }
    ],
    fallback: false // See the "fallback" section below
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains `testGroup: 'im'`
  const { testGroup } = params

  // Pass post data to the page via props
  return { props: { testGroup } }
}

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
