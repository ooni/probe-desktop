/* global require */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
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

const CloseButtonContainer = styled.div`
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 99999;
  cursor: pointer;
`

//name, icon, color, description, longDescription, onClickClose, active
const RunningTest = ({
  testGroup,
  logOpen,
  onToggleLog,
  progressLine,
  percent,
  logLines,
  runningTestName,
  error,
  eta,
  onKill,
  stopping
}) => {
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: testGroup['animation'] || null,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  let TestName = <span />
  if (runningTestName) {
    TestName = <FormattedMessage id={`Test.${runningTestName.split('.')[1]}.Fullname`} />
  }

  // Use the locale used by react-intl to localize the ETA label ('un minuto')
  const { locale } = useIntl()

  const [showModal, setModalState] = useState(false)

  return <StyledRunningTest>
    <Container>
      {(stopping || showModal) || (
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

      <Heading h={2}>{testGroup.name}</Heading>
      {stopping ? (
        <Heading h={3}>
          <FormattedMessage id='Dashboard.Running.Stopping.Title' />
        </Heading>
      ):(
        <Flex flexDirection='column'>
          <Heading h={3}>
            <FormattedMessage id='Dashboard.Running.Running' />
          </Heading>
          <Text fontSize={4}>
            {TestName}
          </Text>
        </Flex>
      )}
      {!logOpen && lottieOptions.animationData && (
        <Lottie
          width={300}
          height={300}
          options={lottieOptions}
          isPaused={stopping}
        />
      )}
      {
        // Show the group logo when animation not available
        !lottieOptions.animationData &&
        React.cloneElement(testGroup.icon, {size: 300})
      }
      {!stopping ? (
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
      {stopping && (
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
}

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

const Running = ({
  testGroupName,
  progressLine,
  percent,
  runningTestName,
  logLines,
  eta,
  error,
  onKill,
  stopping
}) => {

  const [logOpen, setLogOpen] = useState(false)

  const testGroup = testGroups[testGroupName]

  return (
    <WindowContainer bg={testGroup.color}>
      <WindowDraggable bg={testGroup.color} />
      <ContentContainer color={testGroup.color}>
        <RunningTest
          progressLine={progressLine}
          percent={percent}
          runningTestName={runningTestName}
          logLines={logLines}
          error={error}
          testGroup={testGroup}
          logOpen={logOpen}
          onKill={onKill}
          stopping={stopping}
          onToggleLog={() => setLogOpen(!logOpen)}
          eta={eta}
        />
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

Running.propTypes = {
  testGroupName: PropTypes.string,
  progressLine: PropTypes.string,
  percent: PropTypes.number,
  runningTestName: PropTypes.string,
  logLines: PropTypes.array,
  eta: PropTypes.number,
  error: PropTypes.string,
  onKill: PropTypes.func,
  stopping: PropTypes.bool
}

export default Running
