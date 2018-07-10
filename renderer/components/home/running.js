/* global require */
import React from 'react'
import Router from 'next/router'

import Raven from 'raven-js'

import styled from 'styled-components'

import {
  Heading,
  Text,
  Button,
  Container
} from 'ooni-components'

import { testGroups } from '../test-info'

const debug = require('debug')('ooniprobe-desktop.renderer.components.home.running')

const StyledRunningTest = styled.div`
  text-align: center;
`

const CodeLogContainer = styled.div`
  margin: 0 auto;
  width: 80%;
  height: 300px;
  overflow-y: auto;
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

class RunningTestLog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      progressLine: '',
      logLines: [],
      percent: 0,
      runningTest: null,
      error: null
    }
    this.onMessage = this.onMessage.bind(this)
  }

  onMessage(event, data) {
    switch (data.key) {
    case 'ooni.run.progress':
      this.setState({
        percent: data.percentage,
        progressLine: data.message,
        runningTest: {
          name: data.testKey
        }
      })
      break
    case 'error':
      debug('error received', data)
      this.setState({
        error: data.message,
        runningTest: null,
      })
      break
    case 'log':
      debug('log received', data)
      this.setState({
        logLines: this.state.logLines.concat(data.value)
      })
      break
    default:
      break
    }
  }

  componentDidMount() {
    const { ipcRenderer } = require('electron')
    ipcRenderer.on('ooni', this.onMessage)
  }

  render() {
    const {
      progressLine,
      percent,
      runningTest,
      logLines,
      error
    } = this.state

    const {
      logOpen
    } = this.props

    return (
      <div>
        <Heading h={3}>Running {runningTest && runningTest.name}</Heading>
        <div>{progressLine}</div>
        <div>{percent*100}%</div>
        {logOpen && <CodeLog lines={logLines} />}
        {error && <p>{error}</p>}
      </div>
    )
  }
}

//name, icon, color, description, longDescription, onClickClose, active
const RunningTest = ({testGroup, logOpen, onToggleLog}) => {
  return <StyledRunningTest>
    <Heading h={2}>{testGroup.name}</Heading>
    <RunningTestLog logOpen={logOpen} />
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

  componentDidMount() {
    const {
      testGroupName
    } = this.props
    const { remote } = require('electron')

    remote.require('./utils/ooni/run')({testGroupName}).then(() => {
      this.setState({done: true})
      Router.push('/results')
    }).catch(error => {
      Raven.captureException(error, {extra: {scope: 'renderer.runTest'}})
      this.setState({error: error})
    })
  }

  render() {
    const {
      testGroupName
    } = this.props

    const {
      logOpen
    } = this.state

    const testGroup = testGroups[testGroupName]

    return <WindowContainer bg={testGroup.color}>
      <ContentContainer color={testGroup.color}>
        <RunningTest testGroup={testGroup} logOpen={logOpen} onToggleLog={this.onToggleLog}/>
      </ContentContainer>
    </WindowContainer>
  }

}

export default Running
