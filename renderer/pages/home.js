/* global require */

import React from 'react'

import Router from 'next/router'

import Raven from 'raven-js'

import * as chroma from 'chroma-js'

import styled from 'styled-components'

import MdHelp from 'react-icons/lib/md/help'
import MdClear from 'react-icons/lib/md/clear'

import {
  Button,
  Box,
  Flex,
  Heading,
  Card
} from 'ooni-components'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'

import Running from '../components/home/running'

import { testList } from '../components/nettests'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.dashboard')

const CardContent = styled.div`
  position: relative;
  z-index: 10;
  /* Disable text selection */
  user-select: none;
`

const BgIcon = styled.div`
  position: absolute;
  right: ${props => props.active ? '0' : '-30px'};
  top: ${props => props.active ? '0' : '-30px'};
  z-index: -100;
  opacity: 0.5;
`

const TopLeftFloatingButton = styled.div`
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  cursor: pointer;
`

const ConfigureButton = styled(Button)`
  font-size: 12px;
  border-radius: 20px;
  height: 25px;
  line-height: 1;
  padding-left: 15px;
  padding-right: 15px;
  text-transform: none;
  border: 1px solid ${props => props.theme.colors.white};
`

const FrontCardContent = ({name, description, icon, color, toggleCard, onRun, onConfigure}) => (
  <Box w={1/2} pr={3} pb={3}>
    <Card bg={color} color='white' style={{position: 'relative', height: '200px'}}>
      <TopLeftFloatingButton>
        <MdHelp onClick={toggleCard} size={30} />
      </TopLeftFloatingButton>
      <CardContent>
        <Heading h={2}>{name}</Heading>
        <Flex pt={5}>
          <Box w={3/4} pr={4}>
            {description}
          </Box>
          <Box w={1/4} mr={2}>
            <Button inverted fontSize={1} onClick={onRun}>
        Run
            </Button>
          </Box>
        </Flex>
        <BgIcon>
          {icon}
        </BgIcon>
      </CardContent>
    </Card>
  </Box>
)

const BackCardContent = ({name, longDescription, color, toggleCard}) => (
  <Box w={1/2} pr={3} pb={3}>
    <Card bg={chroma(color).darken(2).desaturate()} color='white' style={{position: 'relative', height: '200px', padding: '20px'}}>
      <TopLeftFloatingButton>
        <MdClear onClick={toggleCard} size={30} />
      </TopLeftFloatingButton>
      <CardContent>
        <Heading h={3}>{name}</Heading>
        {longDescription}
      </CardContent>
    </Card>
  </Box>
)

class RunTestCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFlipped: false
    }
    this.toggleCard = this.toggleCard.bind(this)
  }

  toggleCard(idx) {
    this.setState({isFlipped: !this.state.isFlipped})
  }

  render() {
    const {
      isFlipped
    } = this.state

    if (isFlipped) {
      return <BackCardContent
        toggleCard={this.toggleCard}
        {...this.props} />
    }
    return <FrontCardContent
      toggleCard={this.toggleCard}
      {...this.props} />
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,

      runningTestName: null,
      runTestGroupName: null,
      runProgressLine: '',
      runError: null,
      runLogLines: [],
      runPercent: 0,
      runDone: true
    }
    this.onConfigure = this.onConfigure.bind(this)
    this.onRun = this.onRun.bind(this)
    this.onMessage = this.onMessage.bind(this)
  }

  componentWillUnmount() {
    const { ipcRenderer } = require('electron')
    ipcRenderer.removeListener('ooni', this.onMessage)
  }

  componentDidMount() {
    const { ipcRenderer } = require('electron')
    ipcRenderer.on('ooni', this.onMessage)
  }

  onMessage(event, data) {
    switch (data.key) {
    case 'ooni.run.progress':
      this.setState({
        runPercent: data.percentage,
        runProgressLine: data.message,
        runningTestName: {
          name: data.testKey
        }
      })
      break
    case 'error':
      debug('error received', data)
      this.setState({
        runError: data.message,
        runningTestName: null,
      })
      break
    case 'log':
      debug('log received', data)
      this.setState({
        runLogLines: this.state.runLogLines.concat(data.value)
      })
      break
    default:
      break
    }
  }

  onConfigure(groupName) {
    return () => {
      console.log('configuring', groupName)
    }
  }

  onRun(testGroupName) {
    const { remote } = require('electron')
    return () => {
      debug('running', testGroupName)
      this.setState({
        runningTestGroupName: testGroupName
      })
      remote.require('./utils/ooni/run')({testGroupName}).then(() => {
        this.setState({done: true})
        Router.push('/results')
      }).catch(error => {
        debug('error', error)
        Raven.captureException(error, {extra: {scope: 'renderer.runTest'}})
        this.setState({error: error})
      })
    }
  }

  render() {
    const {
      error,
      runningTestGroupName,
      runningTestName,
      runProgressLine,
      runPercent,
      runLogLines,
      runError
    } = this.state

    if (runningTestGroupName) {
      return (
        <Layout>
          <Running
            progressLine={runProgressLine}
            percent={runPercent}
            runningTest={runningTestName}
            logLines={runLogLines}
            error={runError}
            testGroupName={runningTestGroupName}
          />
        </Layout>
      )
    }

    return (
      <Layout>
        <Sidebar>
          <Flex wrap pt={3} pl={3} style={{overflow: 'auto'}}>
            {testList.map((t, idx) =>
              <RunTestCard
                onRun={this.onRun(t.key)}
                onConfigure={this.onConfigure(t.key)}
                key={idx} {...t} />
            )}
          </Flex>
          {error && <p>Error: {error.toString()}</p>}
        </Sidebar>
      </Layout>
    )
  }
}

export default Home
