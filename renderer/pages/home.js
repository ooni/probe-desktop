import React from 'react'

import Link from 'next/link'

import Layout from '../components/Layout'

import styled from 'styled-components'

import {
  Hero,
  HeroLead,
  LogoOONIRun,
  Button,
  Container,
  Box,
  Flex,
  Heading
} from 'ooni-components'

class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Hero pb={4} pt={4}>
          <HeroLead>
          Let's fight internet censorship together!
          </HeroLead>
        </Hero>
        <Container pt={3}>
          <Flex wrap>
            <Box w={[1/2]}>
              <Heading h={2}>Web Censorship</Heading>
              <Button>Run</Button>
            </Box>
            <Box w={[1/2]}>
              <Heading h={2}>Middleboxes</Heading>
              <Button>Run</Button>
            </Box>
            <Box w={[1/2]}>
              <Heading h={2}>Instant Messaging</Heading>
              <Button>Run</Button>
            </Box>
            <Box w={[1/2]}>
              <Heading h={2}>Network Neutrality</Heading>
              <Button>Run</Button>
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}

export default Home
