/* global */
import React from 'react'
import { Flex, Container, Box, Text } from 'ooni-components'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import Layout from '../../components/Layout'
import {
  PROMPT_DELAY,
  shouldShowPrompt,
} from '../../components/betaUpdateConfig'
import Sidebar from '../../components/Sidebar'
import RunTestCard from '../../components/dashboard/RunTestCard'
import useRunTest from '../../components/dashboard/useRunTest'
import { DashboardHeader } from '../../components/dashboard/DashboardHeader'
import { testList } from '../../components/nettests'
import { Button } from 'ooni-components/dist/components'
import { openInBrowser } from '../../components/utils'

const DeprecationNotice = styled(Box)`
  text-align: start;
  background-color: ;
  background: linear-gradient(
    160deg,
    ${(props) => props.theme.colors.orange6} 0%,
    ${(props) => props.theme.colors.yellow6} 100%
  );
  border-radius: 8px;
  color: white;
  // box-shadow: 0px 0px 6px 0px ${(props) => props.theme.colors.gray7};
`

const DownloadButton = styled(Button)`
  color: ${(props) => props.theme.colors.orange6};
  border-radius: 8px;
`

const desktopBetaUrl =
  'https://github.com/ooni/probe-multiplatform/releases/latest'

const Dashboard = () => {
  const router = useRouter()
  const onRunTest = useRunTest()

  useEffect(() => {
    if (!shouldShowPrompt()) return
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-beta-update'))
    }, PROMPT_DELAY)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Layout>
      <Sidebar>
        <DashboardHeader onRunAll={onRunTest('all')} />
        <Container>
          <Flex flexDirection="column">
            <DeprecationNotice mb={4} py={2} px={3}>
              <Flex alignItems="center">
                <Box fontSize={5} mr={3} p={2}>
                  ✨
                </Box>
                <Box ml={3} py={2}>
                  <Flex flexDirection="column">
                    <Text fontSize={2} fontWeight="bolder">
                      New Beta Available!
                    </Text>
                    <Box fontSize={1} mt={2} fontWeight={500}>
                      We've built a new, more sustainable, multiplatform OONI
                      Probe app - and we'd love your help testing it!
                    </Box>
                    <Box>
                      <DownloadButton
                        mt={3}
                        fontWeight="bolder"
                        inverted
                        onClick={(e) => openInBrowser(desktopBetaUrl, e)}
                      >
                        Download Beta
                      </DownloadButton>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </DeprecationNotice>
            {testList.map((t, idx) => (
              <RunTestCard
                onClick={() =>
                  router.push('/dashboard/[testGroup]', `/dashboard/${t.key}`)
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
