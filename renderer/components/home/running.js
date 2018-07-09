import React from 'react'
import Router from 'next/router'

import Raven from 'raven-js'

import styled from 'styled-components'

import { withRouter } from 'next/router'

import {
  Button,
  Container,
  Box,
  Flex,
  Heading,
  Text,
  Card,
  colors
} from 'ooni-components'

import { testGroups } from '../test-info'

const debug = require('debug')('ooniprobe-desktop.renderer.components.home.running')

const StyledRunningTest = styled.div`
  text-align: center;
`

class RunningTestLog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      logLine: '',
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
          logLine: data.message,
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
      logLine,
      percent,
      runningTest,
      error
    } = this.state

    return (
      <div>
        <Heading h={3}>Running {runningTest && runningTest.name}</Heading>
        <div>{logLine}</div>
        <div>{percent*100}%</div>
        {error && <p>{error}</p>}
      </div>
    )
  }
}

//name, icon, color, description, longDescription, onClickClose, active
const RunningTest = ({testGroup}) => {
  return <StyledRunningTest>
    <Heading h={2}>{testGroup.name}</Heading>
    <RunningTestLog />
  </StyledRunningTest>
}

const TopBar = styled.div`
  position: fixed;
  z-index: 1000;
  width: 100%;
  height: 100px;
  background-color: ${props => props.color};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const ContentContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
  background-color: ${props => props.color};
  z-index: 10;
`

class Running extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      done: true
    }
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

    const testGroup = testGroups[testGroupName]

    return <div>
      <TopBar color={testGroup.color} />
      <ContentContainer color={testGroup.color}>
        <RunningTest testGroup={testGroup} />
      </ContentContainer>
    </div>
  }

}

export default Running
