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

import { ipcRenderer } from 'electron'

export default class extends React.Component {
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
              <Link href={{ pathname: '/start', query: { name: 'web-censorship' } }}>
                <Button>Run</Button>
              </Link>
            </Box>
            <Box w={[1/2]}>
              <Heading h={2}>Middleboxes</Heading>
              <Link href={{ pathname: '/start', query: { name: 'middleboxes' } }}>
                <Button>Run</Button>
              </Link>
            </Box>
            <Box w={[1/2]}>
              <Heading h={2}>Instant Messaging</Heading>
              <Link href={{ pathname: '/start', query: { name: 'instant-messaging' } }}>
                <Button>Run</Button>
              </Link>
            </Box>
            <Box w={[1/2]}>
              <Heading h={2}>Network Neutrality</Heading>
              <Link href={{ pathname: '/start', query: { name: 'network-neutrality' } }}>
                <Button>Run</Button>
              </Link>
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
