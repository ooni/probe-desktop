import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { ipcRenderer } from 'electron'
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
const debug = require('debug')('ooniprobe-desktop.renderer.components.dashboard.running')

import { testList, cliTestKeysToGroups, testGroups } from '../nettests'
import { StripedProgress } from './StripedProgress'
import StopTestModal from '../ConfirmationModal'
import NoRTLFlip from '../NoRTLFlip'

const StyledRunningTest = styled.div`
  text-align: center;
  color: white;
  /* This affects the <LineProgress> direction */
  & .rc-progress-line  {
    transform: scaleX(${props => props.isRTL ? -1 : 1});
  }
`

const CodeLogContainer = styled(NoRTLFlip)`
  margin: 0 auto;
  width: 100%;
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  overflow-wrap: break-word;
  background-color: black;
`

const Lines = styled(Text)`
  padding-block-start: 20px;
  padding-inline-start: 20px;
  color: white;
  font-family: monospace;
  white-space: pre;
  text-align: start;
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

export const ToggleLogButton = ({open, onClick}) => {
  if (open) {
    return <ToggleButtonContainer onClick={onClick} data-testid='toggle-log-button'>
      <Box>
        <FormattedMessage id='Dashboard.Running.CloseLog' />
      </Box>
      <Box>
        <MdKeyboardArrowDown size={30} />
      </Box>
    </ToggleButtonContainer>
  }
  return <ToggleButtonContainer onClick={onClick} data-testid='toggle-log-button'>
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

export const Log = ({lines, onToggleLog, open}) => (
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
  min-height: 100vh;
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
ContentContainer.displayName = 'ContentContainer'

const Title = ({ groupName }) => (
  <Heading h={2} data-testid='heading-test-group-name'>
    {groupName ? groupName : <span>&nbsp;</span>}
  </Heading>
)

Title.propTypes = {
  groupName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage)
  ])
}

const MemoizedTitle = React.memo(Title)

const RunningTestnameLabel = ({ runningTestName }) => (
  <React.Fragment>
    <Heading h={3} data-testid='heading-running-test-name'>
      {runningTestName ? (
        <FormattedMessage id='Dashboard.Running.Running' />
      ) : (
        <span><FormattedMessage id='Dashboard.Running.PreparingTest' />...</span>
      )}
    </Heading>
    <Text fontSize={4} data-testid='text-running-test-name'>
      {runningTestName ? (
        <FormattedMessage id={`Test.${runningTestName.split('.')[1]}.Fullname`} defaultMessage={runningTestName.split('.')[1]} />
      ) : (
        <span>&nbsp;</span>
      )}
    </Text>
  </React.Fragment>
)
RunningTestnameLabel.propTypes = {
  runningTestName: PropTypes.string
}

const MemoizedTestNameLabel = React.memo(RunningTestnameLabel)

const Running = ({ testGroupToRun, inputFile = null }) => {
  const [testGroupName, setTestGroupName] = useState(testGroupToRun)
  const [logOpen, setLogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [runningTestName, setRunningTestName] = useState(null)
  const [progressLine, setProgressLine] = useState('')
  const [logLines, setLogLines] = useState([])
  const [percent, setPercent] = useState(0)
  const [eta, setEta] = useState(-1)
  const [, setStopped] = useState(false)
  const [isStopping, setIsStopping] = useState(false)

  const router = useRouter()

  // Upon load, this component sends message to the main process to
  // launch `ooniprobe run` with ${testGroupName} and starts listening
  // on multiple channels for updates.
  // e.g `ooniprobe.running-test`, `ooniprobe.progress`, `ooniprobe.stopping'`

  useEffect(() => {

    ipcRenderer.send('ooniprobe.run', { testGroupToRun, inputFile })

    ipcRenderer.on('ooni', onMessage)
    ipcRenderer.on('ooniprobe.running-test', (_, testGroup) => {
      setTestGroupName(testGroup)
    })
    ipcRenderer.on('ooniprobe.done', (_, completedTestGroup) => {
      const logMessage = `Finished running ${completedTestGroup}`
      setLogLines(oldLogLines => [...oldLogLines, logMessage])
      setPercent(0)
    })
    ipcRenderer.on('ooniprobe.completed', () => {
      setStopped(true)
      router.push('/test-results')
    })

    ipcRenderer.on('ooniprobe.error', (_, error) => {
      const logMessage = error
      setLogLines(oldLogLines => [...oldLogLines, logMessage])
    })

    return () => {
      ipcRenderer.removeListener('ooni', onMessage)
      ipcRenderer.removeAllListeners('ooniprobe.running-test')
      ipcRenderer.removeAllListeners('ooniprobe.done')
      ipcRenderer.removeAllListeners('ooniprobe.error')
    }
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */
  /* Do not add dependencies. This is componentDidMount */

  // Update rest of the state when a new testGroup starts running
  // Without this, it will continue to show the last test name from
  // the previous group.
  // This is expected to happen only during "Run All"
  useEffect(() => {
    setRunningTestName(null)
  }, [testGroupName])

  const onToggleLog = useCallback(() => {
    setLogOpen(!logOpen)
  }, [logOpen])

  const onMessage = useCallback((event, data) => {
    switch (data.key) {
    case 'ooni.run.progress':
      var currentTestGroup = cliTestKeysToGroups[data.testKey] ?? 'experimental'
      if (testGroupName !== currentTestGroup
        && testList.findIndex(item => item.key === currentTestGroup) > -1
      ) {
        setTestGroupName(currentTestGroup)
      }
      data.testKey && setRunningTestName(data.testKey)
      data.message && setProgressLine(data.message)
      data.percentage && setPercent(data.percentage)
      data.eta && setEta(data.eta)
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
  }, [testGroupName, setPercent, setEta, setProgressLine, setError, setRunningTestName, setLogLines])

  const onKill = useCallback(() => {
    if (isStopping !== true) {
      ipcRenderer.send('ooniprobe.stop')
      setIsStopping(true)
    }
  }, [isStopping, setIsStopping])

  const testGroup = testGroups[testGroupName in testGroups ? testGroupName : 'default']

  const testGroupBackupIcon = useMemo(() => {
    return React.cloneElement(testGroup.icon, {size: 300})
  }, [testGroup.icon])

  // Use the locale used by react-intl to localize the ETA label ('un minuto')
  const { locale, isRTL } = useIntl()

  const [showModal, setModalState] = useState(false)

  return (
    <WindowContainer bg={testGroup.color}>
      <WindowDraggable bg={testGroup.color} />
      <ContentContainer color={testGroup.color}>
        <StyledRunningTest isRTL={isRTL}>
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

            <Flex flexDirection='column'>
              {isStopping ? (
                <Heading h={3}>
                  <FormattedMessage id='Dashboard.Running.Stopping.Title' />
                </Heading>
              ):(
                <MemoizedTestNameLabel runningTestName={runningTestName} />
              )}
            </Flex>
            {!logOpen && testGroup['animation'] && (
              <Flex justifyContent='center'>
                <Lottie
                  loop={true}
                  play={!isStopping}
                  data-testid={`running-animation-${testGroupName in testGroups ? testGroupName : 'default'}`}
                  animationData={testGroup['animation']}
                  style={{ width: '300px', height: '300px', alignSelf: 'center', transform: `scaleX(${isRTL ? -1 : 1})` }}
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
                data-testid='running-progress-line'
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
            {progressLine && <Text data-testid='test-progress-message'>{progressLine}</Text>}
          </Container>

          <Log lines={logLines} onToggleLog={onToggleLog} open={logOpen} />
          {error && <p>{error}</p>}
        </StyledRunningTest>
      </ContentContainer>
    </WindowContainer>
  )
}

Running.propTypes = {
  testGroupToRun: PropTypes.string.isRequired,
  inputFile: PropTypes.string
}

export default Running
