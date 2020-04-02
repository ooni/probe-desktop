/* global require */

import React from 'react'

import Router from 'next/router'

import Raven from 'raven-js'

import * as chroma from 'chroma-js'

import styled from 'styled-components'

import { MdHelp, MdClear } from 'react-icons/md'

import { Button, Box, Flex, Heading, Card } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import Layout from '../components/Layout'
import Sidebar from '../components/Sidebar'

import Running from '../components/home/running'

import { testList } from '../components/nettests'
import StickyDraggableHeader from '../components/StickyDraggableHeader'

const debug = require('debug')('ooniprobe-desktop.renderer.pages.dashboard')

const CardContent = styled.div`
  position: relative;
  z-index: 80;
  /* Disable text selection */
  user-select: none;
`

const BgIcon = styled.div`
  position: absolute;
  right: ${props => (props.active ? '0' : '-30px')};
  top: ${props => (props.active ? '0' : '-30px')};
  z-index: -900;
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

const ScrollableBox = styled(Box)`
  max-height: 150px;
  overflow: auto;
`

const FrontCardContent = ({
  name,
  id,
  description,
  icon,
  color,
  toggleCard,
  onRun,
  onConfigure
}) => (
  <Box width={1 / 2} pr={3} pb={3}>
    <Card
      data-test-id={`card-${id}`}
      bg={color}
      color="white"
      style={{ position: 'relative', height: '250px' }}
    >
      <TopLeftFloatingButton>
        <MdHelp onClick={toggleCard} size={30} />
      </TopLeftFloatingButton>
      <CardContent>
        <Heading h={2}>{name}</Heading>
        <BgIcon>{icon}</BgIcon>
        <Flex pt={5} alignItems="center">
          <Box width={3 / 4} pr={4}>
            {description}
          </Box>
          <Box width={1 / 4} mr={2}>
            <Button inverted fontSize={1} onClick={onRun}>
              <FormattedMessage id="Dashboard.Card.Run" />
            </Button>
          </Box>
        </Flex>
      </CardContent>
    </Card>
  </Box>
)

const BackCardContent = ({ name, longDescription, color, toggleCard }) => (
  <Box width={1 / 2} pr={3} pb={3}>
    <Card
      bg={chroma(color)
        .darken(2)
        .desaturate()}
      color="white"
      style={{ position: 'relative', height: '250px', padding: '20px' }}
    >
      <TopLeftFloatingButton>
        <MdClear onClick={toggleCard} size={30} />
      </TopLeftFloatingButton>
      <CardContent>
        <Heading h={3}>{name}</Heading>
        <ScrollableBox>{longDescription}</ScrollableBox>
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
    this.setState({ isFlipped: !this.state.isFlipped })
  }

  render() {
    const { isFlipped } = this.state

    if (isFlipped) {
      return <BackCardContent toggleCard={this.toggleCard} {...this.props} />
    }
    return <FrontCardContent toggleCard={this.toggleCard} {...this.props} />
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      runningTestName: '',
      runTestGroupName: null,
      runProgressLine: '',
      runError: null,
      runLogLines: [],
      runPercent: 0,
      runEta: -1,
      runDone: true,
      stopping: false
    }
    this.onConfigure = this.onConfigure.bind(this)
    this.onRun = this.onRun.bind(this)
    this.onMessage = this.onMessage.bind(this)
    this.onKill = this.onKill.bind(this)
    this.runner = null
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
        runEta: data.eta,
        runProgressLine: data.message,
        runningTestName: data.testKey
      })
      break
    case 'error':
      debug('error received', data)
      this.setState({
        runError: data.message,
        runningTestName: ''
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

  onKill() {
    if (this.runner !== null && this.state.stopping !== true) {
      this.setState({
        stopping: true
      })
      this.runner.kill()
    }
  }

  onRun(testGroupName) {
    const { remote } = require('electron')
    return () => {
      debug('running', testGroupName)
      this.setState({
        runningTestGroupName: testGroupName
      })

      const Runner = remote.require('./utils/ooni/run').Runner
      this.runner = new Runner({ testGroupName })
      this.runner
        .run()
        .then(() => {
          this.setState({ done: true })
          Router.push('/test-results')
        })
        .catch(error => {
          debug('error', error)
          Raven.captureException(error, {
            extra: { scope: 'renderer.runTest' }
          })
          this.setState({ error: error })
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
      runEta,
      runLogLines,
      runError,
      stopping
    } = this.state

    if (runningTestGroupName) {
      return (
        <Layout>
          <Running
            progressLine={runProgressLine}
            percent={runPercent}
            eta={runEta}
            runningTestName={runningTestName}
            logLines={runLogLines}
            error={runError}
            testGroupName={runningTestGroupName}
            onKill={this.onKill}
            stopping={stopping}
          />
        </Layout>
      )
    }

    return (
      <Layout>
        <Sidebar>
          <StickyDraggableHeader height="40px" />
          <Flex flexWrap="wrap" pl={3}>
            {testList.map((t, idx) => (
              <RunTestCard
                onRun={this.onRun(t.key)}
                onConfigure={this.onConfigure(t.key)}
                key={idx}
                id={t.key}
                {...t}
              />
            ))}
          </Flex>
          {error && <p>Error: {error.toString()}</p>}
        </Sidebar>
      </Layout>
    )
  }
}

export default Home
