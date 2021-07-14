/* global */
import React from 'react'
import { Flex, Container } from 'ooni-components'
import { useRouter } from 'next/router'

import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import RunTestCard from '../../components/dashboard/RunTestCard'
import useRunTest from '../../components/dashboard/useRunTest'
import { DashboardHeader } from '../../components/dashboard/DashboardHeader'
import { testList } from '../../components/nettests'

const Dashboard = () => {
  const router = useRouter()
  const onRunTest = useRunTest()

  return (
    <Layout>
      <Sidebar>
        <DashboardHeader onRunAll={onRunTest('all')}/>
        <Container>
          <Flex flexDirection="column">
            {testList.map((t, idx) => (
              <RunTestCard
                onClick={
                  () => router.push('/dashboard/[testGroup]',
                    `/dashboard/${t.key}`
                  )
                }
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

export default Dashboard
