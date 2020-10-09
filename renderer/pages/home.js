/* global require */
import React, { useState, useCallback, useEffect } from 'react'
import Router from 'next/router'
import Raven from 'raven-js'
import * as chroma from 'chroma-js'
import styled from 'styled-components'
import { MdHelp, MdClear } from 'react-icons/md'
import { Button, Text, Box, Flex, Heading, Card } from 'ooni-components'
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
  onRun
}) => (
  <Box width={1 / 2} pr={3} pb={3}>
    <Card
      // fontSize={0} because padding on Card is controlled by `fontSizeMult`
      fontSize={0}
      data-test-id={`card-${id}`}
      bg={color}
      color="white"
      style={{ position: 'relative', height: '250px' }}
    >
      <TopLeftFloatingButton>
        <MdHelp onClick={toggleCard} size={30} />
      </TopLeftFloatingButton>
      <CardContent>
        <Flex flexDirection='column' justifyContent='space-between' style={{ height: '200px'}}>
          <Text fontSize={4} fontWeight={300} m={0}>{name}</Text>
          <Text fontSize={1} as='div'>
            {description}
          </Text>
          <BgIcon>{icon}</BgIcon>
          <Flex justifyContent='flex-end'>
            <Box>
              <Button inverted fontSize={1} onClick={onRun}>
                <FormattedMessage id="Dashboard.Card.Run" />
              </Button>
            </Box>
          </Flex>
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

const RunTestCard = (props) => {
  const [isFlipped, flipCard] = useState(false)

  const toggleCard = useCallback(() => {
    flipCard(!isFlipped)
  }, [isFlipped])

  if (isFlipped) {
    return <BackCardContent toggleCard={toggleCard} {...props} />
  }
  return <FrontCardContent toggleCard={toggleCard} {...props} />
}

const Home = () => {
  const [runningTestGroupName, setRunningTestGroupName] = useState(null)

  const onRun = useCallback((testGroupName) => {
    return () => {
      debug('running', testGroupName)
      setRunningTestGroupName(testGroupName)
    }
  }, [])

  if (runningTestGroupName) {
    return (
      <Layout>
        <Running testGroupName={runningTestGroupName} />
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
              onRun={onRun(t.key)}
              key={idx}
              id={t.key}
              {...t}
            />
          ))}
        </Flex>
      </Sidebar>
    </Layout>
  )
}

export default Home
