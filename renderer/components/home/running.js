/* global require */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Router from 'next/router'
import Raven from 'raven-js'

import styled from 'styled-components'
import {
  Flex,
  Box,
  Heading,
  Text,
  Container,
  theme
} from 'ooni-components'
import { Line as LineProgress } from 'rc-progress'
import { FormattedMessage, useIntl } from 'react-intl'
import { MdClear, MdKeyboardArrowUp, MdKeyboardArrowDown} from 'react-icons/md'
import Lottie from 'react-lottie'
import moment from 'moment'
const debug = require('debug')('ooniprobe-desktop.renderer.components.home.running')

import { testGroups } from '../nettests'
import { StripedProgress } from './StripedProgress'
import StopTestModal from './StopTestModal'

const StyledRunningTest = styled.div`
  text-align: center;
  color: white;
`

const CodeLogContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  overflow-wrap: break-word;
  background-color: black;
`

const Lines = styled(Text)`
  padding-top: 20px;
  padding-left: 20px;
  color: white;
  font-family: monospace;
  white-space: pre;
  text-align: left;
`

const ToggleButtonContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.gray4};
  }
`

const ToggleLogButton = ({open, onClick}) => {
  if (open) {
    return <ToggleButtonContainer onClick={onClick}>
      <Box>
        <FormattedMessage id='Dashboard.Running.CloseLog' />
      </Box>
      <Box>
        <MdKeyboardArrowDown size={30} />
      </Box>
    </ToggleButtonContainer>
  }
  return <ToggleButtonContainer onClick={onClick}>
    <Box>
      <FormattedMessage id='Dashboard.Running.ShowLog' />
    </Box>
    <Box>
      <MdKeyboardArrowUp size={30} />
    </Box>
  </ToggleButtonContainer>
}

const CodeLog = ({lines}) => {
  return (
    <CodeLogContainer>
      <Lines>{lines.join('\n')}</Lines>
    </CodeLogContainer>
  )
}

const LogContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`

const Log = ({lines, onToggleLog, open}) => (
  <LogContainer>
    <ToggleLogButton onClick={onToggleLog} open={open} />
    {open && <CodeLog lines={lines} />}
  </LogContainer>
)

const MemoizedLog = React.memo(Log)

const CloseButtonContainer = styled.div`
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 99999;
  cursor: pointer;
`

const WindowContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.bg};
`

const WindowDraggable = styled.div`
  background-color: ${props => props.bg};
  height: 50px;
  width: 100%;
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const ContentContainer = styled.div`
  width: 100%;
  z-index: 10;
`

const Title = ({ groupName }) => (
  <Heading h={2}>{groupName}</Heading>
)

const MemoizedTitle = React.memo(Title)

const Running = ({ testGroupName }) => {
  const [logOpen, setLogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [runningTestName, setRunningTestName] = useState(null)
  const [progressLine, setProgressLine] = useState('')
  const [runError, setRunError] = useState(null)
  const [logLines, setLogLines] = useState([])
  const [percent, setPercent] = useState(0)
  const [eta, setEta] = useState(-1)
  const [stopped, setStopped] = useState(false)
  const [isStopping, setIsStopping] = useState(false)

  let runner = null

  useEffect(() => {
    const { ipcRenderer, remote } = require('electron')
    ipcRenderer.on('ooni', onMessage)

    debug('running', testGroupName)

    const Runner = remote.require('./utils/ooni/run').Runner
    runner = new Runner({ testGroupName })
    runner
      .run()
      .then(() => {
        setStopped(true)
        Router.push('/test-results')
      })
      .catch(error => {
        debug('error', error)
        Raven.captureException(error, {
          extra: { scope: 'renderer.runTest' }
        })
        setError(error)
      })


    return () => {
      const { ipcRenderer } = require('electron')
      ipcRenderer.removeListener('ooni', onMessage)
    }
  }, [])

  const onToggleLog = useCallback(() => {
    setLogOpen(!logOpen)
  }, [logOpen])

  const onMessage = useCallback((event, data) => {
    switch (data.key) {
    case 'ooni.run.progress':
      setRunningTestName(data.testKey)
      setPercent(data.percentage)
      setEta(data.eta)
      setProgressLine(data.message)
      break
    case 'error':
      debug('error received', data)
      setRunError(data.message)
      setRunningTestName('')
      break
    case 'log':
      debug('log received', data)
      setLogLines(logLines.concat(data.value))
      break
    default:
      break
    }
  }, [logLines.length, setRunningTestName, setPercent, setEta, setProgressLine, setRunError, setRunningTestName, setLogLines])

  const onKill = useCallback(() => {
    if (runner !== null && isStopping !== true) {
      runner.kill()
      setIsStopping(true)
    }
  }, [isStopping, setIsStopping, runner])

  const testGroup = testGroups[testGroupName]

  const testName = useMemo(() => (
    runningTestName ? (
      <FormattedMessage id={`Test.${runningTestName.split('.')[1]}.Fullname`} />
    ) : (
      <span />
    )
  ), [runningTestName])

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: testGroup['animation'] || null,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const testGroupBackupIcon = useMemo(() => {
    return React.cloneElement(testGroup.icon, {size: 300})
  }, [testGroup.icon])

  // Use the locale used by react-intl to localize the ETA label ('un minuto')
  const { locale } = useIntl()

  const [showModal, setModalState] = useState(false)

  return (
    <WindowContainer bg={testGroup.color}>
      <WindowDraggable bg={testGroup.color} />
      <ContentContainer color={testGroup.color}>
        <StyledRunningTest>
          <Container>
            {(isStopping || showModal) || (
              <CloseButtonContainer>
                <MdClear onClick={() => setModalState(true)} size={30} />
              </CloseButtonContainer>
            )}

            <StopTestModal
              show={showModal}
              onConfirm={() => {
                onKill()
                setModalState(false)
              }}
              onCancel={() => setModalState(false)}
            />

            <MemoizedTitle groupName={testGroup.name} />

            {isStopping ? (
              <Heading h={3}>
                <FormattedMessage id='Dashboard.Running.Stopping.Title' />
              </Heading>
            ):(
              <Flex flexDirection='column'>
                <Heading h={3}>
                  <FormattedMessage id='Dashboard.Running.Running' />
                </Heading>
                <Text fontSize={4}>
                  {testName}
                </Text>
              </Flex>
            )}
            {!logOpen && lottieOptions.animationData && (
              <Lottie
                width={300}
                height={300}
                options={lottieOptions}
                isPaused={isStopping}
              />
            )}
            {
              // Show the group logo when animation not available
              !lottieOptions.animationData && testGroupBackupIcon
            }
            {!isStopping ? (
              <LineProgress
                percent={percent*100}
                strokeColor={theme.colors.white}
                strokeWidth='2'
                trailColor='rgba(255,255,255,0.4)'
                trailWidth='2'
              />
            ) : (
              <StripedProgress />
            )}
            {isStopping && (
              <Text my={2}>
                <FormattedMessage id='Dashboard.Running.Stopping.Notice' />
              </Text>
            )}
            {eta > 0 &&
              <Flex justifyContent='center'>
                <Box pr={1}>
                  <FormattedMessage id='Dashboard.Running.EstimatedTimeLeft' />
                </Box>
                <Box>
                  {moment.duration(eta*1000).locale(locale).humanize()}
                </Box>
              </Flex>
            }
            {progressLine && <Text>{progressLine}</Text>}
          </Container>

          <MemoizedLog lines={logLines} onToggleLog={onToggleLog} open={logOpen} />
          {error && <p>{error}</p>}
        </StyledRunningTest>
      </ContentContainer>
    </WindowContainer>
  )
}

Running.defaultProps = {
  progressLine: '',
  percent: 0,
  eta: -1,
  logLines: [],
  error: null,
  runningTestName: ''
}
export default Running
