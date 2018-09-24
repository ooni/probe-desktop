/* global require */
import React from 'react'

import styled from 'styled-components'

import {
  Heading,
  Text,
  Button
} from 'ooni-components'

import { testGroups } from '../nettests'

const debug = require('debug')('ooniprobe-desktop.renderer.components.home.running')

const StyledRunningTest = styled.div`
  text-align: center;
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
  color: white;
  font-family: monospace;
  white-space: pre;
  text-align: left;
`

const CodeLog = ({lines}) => {
  return (
    <CodeLogContainer>
      <Lines>{lines.join('\n')}</Lines>
    </CodeLogContainer>
  )
}

//name, icon, color, description, longDescription, onClickClose, active
const RunningTest = ({testGroup, logOpen, onToggleLog, progressLine, percent, logLines, runningTest, error}) => {
  return <StyledRunningTest>
    <Heading h={2}>{testGroup.name}</Heading>
    <Heading h={3}>Running {runningTest && runningTest.name}</Heading>
    <div>{progressLine}</div>
    <div>{percent*100}%</div>
    {logOpen && <CodeLog lines={logLines} />}
    {error && <p>{error}</p>}
    {logOpen
      ? <Button inverted hollow onClick={onToggleLog}>Hide log</Button>
      : <Button inverted hollow onClick={onToggleLog}>Show log</Button>}
  </StyledRunningTest>
}

const WindowContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: ${props => props.bg};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const ContentContainer = styled.div`
  padding-top: 100px;
  width: 100%;
  z-index: 10;
`

class Running extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      logOpen: false,
      done: true
    }
    this.onToggleLog = this.onToggleLog.bind(this)
  }

  onToggleLog() {
    this.setState({
      logOpen: !this.state.logOpen
    })
  }

  render() {
    const {
      testGroupName,
      progressLine,
      percent,
      runningTest,
      logLines,
      error
    } = this.props

    const {
      logOpen
    } = this.state

    const testGroup = testGroups[testGroupName]

    return <WindowContainer bg={testGroup.color}>
      <ContentContainer color={testGroup.color}>
        <RunningTest
          progressLine={progressLine}
          percent={percent}
          runningTest={runningTest}
          logLines={logLines}
          error={error}
          testGroup={testGroup}
          logOpen={logOpen}
          onToggleLog={this.onToggleLog}
        />
      </ContentContainer>
    </WindowContainer>
  }
}

Running.defaultProps = {
  progressLine: '',
  percent: 0,
  logLines: [],
  error: null
}
export default Running
