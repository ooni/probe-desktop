import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Hero, Container, Flex, Box, Button, Input } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'

import Layout from 'components/Layout'
import Sidebar from 'components/Sidebar'
import BackButton from 'components/BackButton'
import { inputFileRequest, inputFileResponse } from '../../../../main/ipcBindings'

const StyledHero = styled(Hero)`
  -webkit-app-region: drag;
  /* Hero has Container that has a default padding */
  ${Container} {
    padding-left: 0;
  }
`

const temporaryTestList = [
  'https://ooni.org',
  'https://thepiratebay.org',
  'https://explorer.ooni.org'
]

const TestChosenWebsites = () => {
  const router = useRouter()
  const [testList, setTestList] = useState(temporaryTestList)

  const runTest = useCallback(() => {
    // generate file
    ipcRenderer.send(inputFileRequest, testList.join('\n'))
    // send file to ooniprobe run websites --input-file <file-name>
  }, [testList])

  useEffect(() => {
    ipcRenderer.on(inputFileResponse, (event, args) => {
      router.push(
        {
          pathname: '/dashboard/running',
          query: {
            runningTestGroupName: 'websites',
            inputFile: args.filename
          },
        },
        '/dashboard/running',
        {
          shallow: true
        }
      )
    })
    // return () => {
    //   ipcRenderer.removeAllListeners
    // }
  }, [])

  return (
    <Layout>
      <Sidebar>
        <StyledHero py={3}>
          <Flex justifyContent='center' alignItems='center'>
            <Box mr='auto'>
              <BackButton size={24} onClick={() => router.back()}/>
            </Box>
            <Box mr='auto'>
              <FormattedMessage id='Settings.Websites.CustomURL.Title' />
            </Box>
          </Flex>
        </StyledHero>
        <Container>
          {testList.map((url, idx) => <Box key={idx}>{url}</Box>)}
          <Flex my={4}>
            <Button onClick={() => runTest()}>Run Test</Button>
          </Flex>
        </Container>
      </Sidebar>
    </Layout>
  )
}

export default TestChosenWebsites
