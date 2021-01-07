/* global require */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
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
import Lottie from 'react-lottie-player'
import moment from 'moment'
const debug = require('debug')('ooniprobe-desktop.renderer.components.home.running')

import { testGroups } from '../nettests'
import { StripedProgress } from './StripedProgress'
import StopTestModal from '../ConfirmationModal'

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

ToggleLogButton.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func
}

const CodeLog = ({lines}) => {
  return (
    <CodeLogContainer>
      <Lines>{lines.join('\n')}</Lines>
    </CodeLogContainer>
  )
}

CodeLog.propTypes = {
  lines: PropTypes.array,
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

Log.propTypes = {
  lines: PropTypes.array,
  onToggleLog: PropTypes.func,
  open: PropTypes.bool
}

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

Title.propTypes = {
  groupName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage)
  ])
}

const MemoizedTitle = React.memo(Title)

const Running = ({ testGroupName }) => {
  const [logOpen, setLogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [runningTestName, setRunningTestName] = useState(null)
  const [progressLine, setProgressLine] = useState('')
  const [logLines, setLogLines] = useState([])
  const [percent, setPercent] = useState(0)
  const [eta, setEta] = useState(-1)
  const [, setStopped] = useState(false)
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
        setStopped(true)
      })

    return () => {
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
      setError(data.message)
      setRunningTestName('')
      break
    case 'log':
      debug('log received', data)
      setLogLines(oldLogLines => [...oldLogLines, data.value])
      break
    default:
      break
    }
  }, [setPercent, setEta, setProgressLine, setError, setRunningTestName, setLogLines])

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

            {showModal &&
              <StopTestModal
                show={showModal}
                title={<FormattedMessage id='Modal.InterruptTest.Title' />}
                body={<FormattedMessage id='Modal.InterruptTest.Paragraph' />}
                confirmLabel={<FormattedMessage id='Modal.OK' />}
                cancelLabel={<FormattedMessage id='Modal.Cancel' />}
                onConfirm={() => {
                  onKill()
                  setModalState(false)
                }}
                onCancel={() => setModalState(false)}
              />
            }

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
            {!logOpen && testGroup['animation'] && (
              <Flex justifyContent='center'>
                <Lottie
                  loop={true}
                  play={!isStopping}
                  animationData={testGroup['animation']}
                  style={{ width: '300px', height: '300px', alignSelf: 'center' }}
                  rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                  }}
                />
              </Flex>
            )}
            {
              // Show the group logo when animation not available
              !testGroup['animation'] && testGroupBackupIcon
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

          <Log lines={logLines} onToggleLog={onToggleLog} open={logOpen} />
          {error && <p>{error}</p>}
        </StyledRunningTest>
      </ContentContainer>
    </WindowContainer>
  )
}

Running.propTypes = {
  testGroupName: PropTypes.string.isRequired
}

export default Running
