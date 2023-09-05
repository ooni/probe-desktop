import React, { useEffect, useState } from 'react'
import humanize from 'humanize'
import { Line as LineProgress } from 'rc-progress'
import OONIHorizontalMonochromeInverted from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochromeInverted.svg'
import {
  Container,
  Button,
  Heading,
  Flex,
  Text,
  Box,
  theme
} from 'ooni-components'
import styled from 'styled-components'

import Layout from '../components/Layout'
import FormattedMarkdownMessage from '../components/FormattedMarkdownMessage'
import formatSpeed from '../components/formatSpeed'
import { version, probeVersion } from '../../package.json'

const CodeWithWrap = styled.code`
  word-wrap: break-word;
  overflow-wrap: break-word;
`

const UpdaterBoxContainer = styled(Flex)`
  padding: 20px;
  background-color: ${props => props.theme.colors.gray1};
`

const UpdaterBox = ({message, progressObj}) => {
  let speed
  if (progressObj.bytesPerSecond) {
    speed = formatSpeed(progressObj.bytesPerSecond / 1000)
  }
  return (
    <UpdaterBoxContainer flexWrap='wrap'>
      <Box width={1}>
        <Text fontWeight='bold'>{message}</Text>
      </Box>
      {speed
      && <Box width={1}>
        <LineProgress
          percent={progressObj.percent}
          strokeColor={theme.colors.blue3}
          strokeWidth='2'
          trailColor={theme.colors.blue1}
          trailWidth='2'
        />
      </Box>
      }
      {speed
      && <Box width={1}>
        {speed.value} {speed.unit} ({humanize.filesize(progressObj.transferred)}/{humanize.filesize(progressObj.total)})
      </Box>
      }
    </UpdaterBoxContainer>
  )
}

const About = () => {
  const [debugPaths, setDebugPaths] = useState({})
  const [progressObj, setProgressObj] = useState({
    percent: 0,
    bytesPerSecond: 0,
    total: 0,
    transferred: 0,
  })
  const [msg, setMsg] = useState('')
  const [updateMessage, setUpdateMessage] = useState('')

  const onReset = () => {
    window.electron.about.reset().then((success) => {
      if (success) {
        setMsg('Successfully reset OONI Probe. Please close and re-open the application.')
      }
    })
  }

  useEffect(() => {
    const paths = window.electron.about.debugGetAllPaths()
    setDebugPaths(paths)

    const removeUpdateMessageListener = window.electron.about.updateMessage(setUpdateMessage)
    const removeUpdateProgressListener = window.electron.about.updateProgress(setProgressObj)

    return () => {
      removeUpdateMessageListener()
      removeUpdateProgressListener()
    }
  }, [])

  return (
    <Layout>
      <Flex flexDirection='column' alignItems='center' bg='blue5' py={5}>
        {/* <Box>
          <OONIHorizontalMonochromeInverted width='200px' />
        </Box> */}
        <Box mt={3}>
          <Text fontSize={14} color='white'>{version}</Text>
        </Box>
        <Box mt={3}>
          <Text fontSize={14} color='white'>Probe CLI version: {probeVersion}</Text>
        </Box>
      </Flex>
      <Container>
        {updateMessage.length > 0
        && <UpdaterBox message={updateMessage} progressObj={progressObj} />}

        <Text>
          <FormattedMarkdownMessage id='Settings.About.Content.Paragraph' />
        </Text>


        <Flex justifyContent='center' alignItems='center' pt={2}>
          <Box>
            <Button onClick={onReset}>Hard reset</Button>
          </Box>
        </Flex>
        <Flex flexDirection='column' my={2} dir='ltr'>
          <Box>
            <Heading textAlign='center' h={4}>Debug information</Heading>
          </Box>
          <Box bg='gray1' p={2}>
            {Object.keys(debugPaths).map(key => {
              return (
                <Flex key={key} flexDirection='column' mb={3}>
                  <Box>
                    <Text fontWeight='bold'>{key}</Text>
                  </Box>
                  <Box>
                    <CodeWithWrap>{debugPaths[key]}</CodeWithWrap>
                  </Box>
                </Flex>
              )
            })}
          </Box>
        </Flex>

        {msg && <Heading h={4} color='red5'>{msg}</Heading>}
      </Container>
    </Layout>
  )
}

export default About
