import electron from 'electron'
import React from 'react'
import Raven from 'raven-js'

import Link from 'next/link'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'

import styled, { keyframes } from 'styled-components'

import MdCancel from 'react-icons/lib/md/cancel'
import MdWeb from 'react-icons/lib/md/web'
import MdChat from 'react-icons/lib/md/chat'
import MdComputer from 'react-icons/lib/md/computer'
import MdRestore from 'react-icons/lib/md/restore'
import MdUnarchive from 'react-icons/lib/md/unarchive'

import IoSpeedometer from 'react-icons/lib/io/speedometer'

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

const debug = require('debug')('ooniprobe-desktop.renderer.pages.dashboard')

// XXX these should all go into components
const dummyDesc = 'Blocking, nostrud do est, ut occaecat aute blocking, traffic manipulation minim excepteur.'
const dummyLongDesc = 'In, internet in, Tor packet capture, blocking, internet Tor culpa, social media blocking connection reset traffic manipulation. Eu Tor aliquip, dolore network interference TCP, middlebox TLS handshake connection reset ut cupidatat TLS handshake traffic manipulation. Consectetur surveillance non Tor voluptate UDP surveillance DNS tampering ut Tor velit velit packet capture, consequat dolore eiusmod. Adipisicing UDP network interference UDP est Tor, middlebox TLS handshake internet proident, OONI OONI excepteur. Irure sunt, elit internet occaecat, DNS tampering, surveillance deserunt Open Observatory of Network Interference surveillance do.'
const iconSize = 200
const iconColor = colors.palette.black
const testList  = [
    {
      name: 'Web Censorship',
      key: 'websites',
      color: colors.palette.indigo4,
      description: dummyDesc,
      longDescription: dummyLongDesc,
      icon: <MdWeb size={iconSize} color={iconColor} />,
    },
    {
      name: 'IM Blocking',
      key: 'im',
      color: colors.palette.green4,
      description: dummyDesc,
      longDescription: dummyLongDesc,
      icon: <MdChat size={iconSize} color={iconColor} />
    },
    {
      name: 'Performance',
      key: 'performance',
      color: colors.palette.fuschia4,
      description: dummyDesc,
      longDescription: dummyLongDesc,
      icon: <IoSpeedometer size={iconSize} color={iconColor} />
    },
    {
      name: 'Middle boxes',
      key: 'middleboxes',
      color: colors.palette.yellow4,
      description: dummyDesc,
      longDescription: dummyLongDesc,
      icon: <MdUnarchive size={iconSize} color={iconColor} />
    },
]

const StyledRunTestCard = styled.div`
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
  width: 200px;
  height: 120px;
  color: ${ props => props.theme.colors.gray9 };

  &:hover {
    color: ${ props => props.theme.colors.gray7 };
  }
`

const CardContent = styled.div`
  position: relative;
  z-index: 10;
  /* Disable text selection */
  user-select: none;
  /* Ensure we always have a pointer */
  cursor: pointer;
`

const BgIcon = styled.div`
  position: absolute;
  right: ${props => props.active ? '0' : '-30px'};
  top: ${props => props.active ? '0' : '-30px'};
  z-index: -100;
  opacity: 0.5;
`
const RunTestCardContent = ({name, description, icon}) => (
  <CardContent>
    <Heading h={2}>{name}</Heading>
    <Flex pt={5}>
      <Box w={3/4} pr={4}>
        <Text>{description}</Text>
      </Box>
      <Box w={1/4} mr={2}>
        <Button inverted>
        Run
        </Button>
      </Box>
    </Flex>
    <BgIcon>
      {icon}
    </BgIcon>
  </CardContent>
)

const RunTestCard = ({name, icon, color, description, onClick}) => (
  <Box w={1/2} pr={3} pb={3}>
    <Card bg={color} color='white' onClick={onClick}>
      <RunTestCardContent icon={icon} name={name} description={description} />
    </Card>
  </Box>
)

const Shrinking = keyframes`
  from {
    visibility: visible;
    height: 200px;
    width: 50%;
    opacity: 1;
  }
  to {
    visibility: hidden;
    height: 0px;
    width: 0%;
    opacity: 0;
  }
`

const Growing = keyframes`
  from {
    padding: 0px;
    width: 50%;
  }
  to {
    padding: 20px;
    width: 100%;
  }
`

const StyledGrowingContainer = styled(Box)`
  ${props => props.active ? 'width: 100%;' : 'height: 0;overflow: hidden;'}
  visibility: ${props => props.active ? 'visible' : 'hidden'};
  animation: ${props => props.active ? Growing : Shrinking } 0.3s ease;
  background-color: ${props => props.color};
  padding: ${props => props.active ? '20px' : '0'};
  position: relative;
`

const AnimatedTestDetails = keyframes`
  from {
    border-radius: 10px;
    margin-top: 2px;
    margin-bottom: 2px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.38);
  }
  to {
    border-radius: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding: 0px;
    box-shadow: none;
  }
`

const StyledTestDetails = styled(Card)`
  border-radius: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0px;
  box-shadow: none;
  &:hover {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  &:active {
    box-shadow: none;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  ${props => props.active ? `animation: ${AnimatedTestDetails} 0.3s ease;` : ''}
`
const CenterIcon = styled.div`
  text-align: center;
`

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: ${props => props.theme.colors.black};
  &:hover {
    color: ${props => props.theme.colors.gray7};
  }
  &:active {
    color: ${props => props.theme.colors.gray6};
  }
`

const CenterBox = styled(Box)`
  width: 100%;
  text-align: center;
  p {
    display: inline-block;
    padding-right: 5px;
  }
`

const OpenTestCard = (props) => {
  const {
    name, icon, color, description, longDescription,
    onClickClose, onClickRun, active
  } = props
  return (
  <div style={{width: '100%'}}>
  <StyledGrowingContainer active={active} color={color}>
    <CloseButton {...props} onClick={onClickClose}>
      <MdCancel size={30} />
    </CloseButton>
    <StyledTestDetails bg={color} color='white' active={active}>
      {active && <div>
        <CenterIcon>
        {React.cloneElement(icon, {color:'white'})}
        </CenterIcon>
        <Heading center h={1}>{name}</Heading>
        <Flex wrap>
        <CenterBox pb={2}>
          <Button hollow inverted fontSize={1}>
            Configure
          </Button>
        </CenterBox>
        <CenterBox pb={4}>
          <Text bold>~2</Text><Text>minutes </Text>
          <Text bold>10.4</Text><Text>MB</Text>
        </CenterBox>
        <CenterBox>
          <Button inverted fontSize={2} onClick={onClickRun}>
            Run
          </Button>
        </CenterBox>
        <CenterBox pb={2} pt={2}>
          <MdRestore /> <Text bold>2 days</Text><Text>ago </Text>
        </CenterBox>
        </Flex>
      </div>}
      {!active && <RunTestCardContent icon={icon} name={name} description={description} />}
    </StyledTestDetails>

  </StyledGrowingContainer>
  {active && <Container pt={2}>
    <Heading h={3} center>Description</Heading>
    <Text center>{longDescription}</Text>
    </Container>}
  </div>
  )
}

const CardList = ({testList, activeIdx, toggleCard, runTest}) => {
  return (
    <Flex wrap p={activeIdx !== null ? 0 : 3}>
      {testList.map((t, idx) => {
        if (activeIdx === null) {
          return (
            <RunTestCard
              key={idx}
              onClick={() => toggleCard(idx)}
              {...t} />
          )
        }
        return (
          <OpenTestCard
            key={idx}
            active={activeIdx === idx}
            onClickRun={() => runTest(idx)}
            onClickClose={() => toggleCard(idx)} {...t} />
        )
      })}
    </Flex>
  )
}

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
const RunningTest = ({activeTest}) => {
  return <StyledRunningTest>
    <Heading h={2}>{activeTest.name}</Heading>
    <RunningTestLog />
  </StyledRunningTest>
}

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeCardIdx: null,
      activeTestIdx: null,
      error: null
    }
    this.toggleCard = this.toggleCard.bind(this)
    this.runTest = this.runTest.bind(this)
  }

  componentDidMount() {
    const remote = electron.remote
    this.run = remote.require('./utils/ooni/run')
  }

  toggleCard(idx) {
    if (this.state.activeCardIdx !== null) {
      this.setState({activeCardIdx: null})
    } else {
      this.setState({activeCardIdx: idx})
    }
  }

  runTest (idx) {
    this.setState({activeTestIdx: idx})
    this.run({testGroupName: testList[idx].key}).then(() => {
      this.setState({activeTestIdx: null})
    }).catch(error => {
      Raven.captureException(error, {extra: {scope: 'renderer.runTest'}})
      this.setState({error: error})
    })
  }

  render() {
    const {
      activeCardIdx,
      activeTestIdx,
      error
    } = this.state
    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          {activeTestIdx === null
          && <CardList
              testList={testList}
              activeIdx={activeCardIdx}
              toggleCard={this.toggleCard}
              runTest={this.runTest} />
          }
          {activeTestIdx !== null
          && <RunningTest
              activeTest={testList[activeTestIdx]} />
          }
          {error && <p>Error: {error.toString()}</p>}

        </Sidebar>
      </Layout>
    )
  }
}

export default Home
