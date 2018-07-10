/* global require */

import electron from 'electron'
import React from 'react'

import * as chroma from 'chroma-js'

import Link from 'next/link'

import styled from 'styled-components'

import MdHelp from 'react-icons/lib/md/help'
import MdClear from 'react-icons/lib/md/clear'

import {
  Button,
  Box,
  Flex,
  Heading,
  Text,
  Card,
  colors
} from 'ooni-components'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'

import Running from '../components/home/running'

import { testList } from '../components/test-info'

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
    <Card bg={color} color='white' style={{position: 'relative', padding: '20px 32px'}}>
      <TopLeftFloatingButton>
        <MdHelp onClick={toggleCard} size={30} />
      </TopLeftFloatingButton>
      <CardContent>
        <Heading h={2}>{name}</Heading>
        <ConfigureButton hollow inverted fontSize={1} onClick={onConfigure}>
      Configure
        </ConfigureButton>
        <Flex pt={5}>
          <Box w={3/4} pr={4}>
            <Text>{description}</Text>
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

const BackCardContent = ({name, longDescription, icon, color, toggleCard}) => (
  <Box w={1/2} pr={3} pb={3}>
    <Card bg={chroma(color).darken(2).desaturate()} color='white' style={{position: 'relative'}}>
      <TopLeftFloatingButton>
        <MdClear onClick={toggleCard} size={30} />
      </TopLeftFloatingButton>
      <CardContent>
        <Heading h={2}>{name}</Heading>
        <Text>{longDescription}</Text>
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
      runningTestGroup: null
    }
    this.onConfigure = this.onConfigure.bind(this)
    this.onRun = this.onRun.bind(this)
  }

  onConfigure(groupName) {
    return () => {
      console.log('configuring', groupName)
    }
  }

  onRun(groupName) {
    return () => {
      console.log('running', groupName)
      this.setState({runningTestGroup: groupName})
    }
  }

  render() {
    const {
      error,
      runningTestGroup
    } = this.state

    if (runningTestGroup) {
      return (
        <Layout>
          <Running testGroupName={runningTestGroup} />
        </Layout>
      )
    }

    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <Flex wrap p={3} style={{overflow: 'auto'}}>
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
