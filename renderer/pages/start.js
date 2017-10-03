import React from 'react'

import Layout from '../components/Layout'

import styled from 'styled-components'

import {
  Hero,
  HeroLead,
  LogoOONIRun,
  Link,
  Button,
  Container,
  Box,
  Pre,
  Flex,
  Heading
} from 'ooni-components'

import { ipcRenderer } from 'electron'

// XXX use this:
// https://github.com/electron/electron/blob/master/docs/api/remote.md

export default class extends React.Component {

  static async getInitialProps({ req, query }) {
    return {testName: query.name}
  }

  constructor(props) {
    super(props)
    this.state = {
      testOutput: '',
      running: false
    }

    this.startTest = this.startTest.bind(this)
    this.onTestOutput = this.onTestOutput.bind(this)
    this.onTestDone = this.onTestDone.bind(this)
  }

  startTest(testName) {
    return () => {
      this.setState({
        testOutput: '',
        running: true
      })
    }
  }

  onTestOutput(e, arg) {
    this.setState({
      testOutput: `${this.state.testOutput}${arg}`
    })
  }

  onTestDone(e, arg) {
    this.setState({running: false})
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { testName } = this.props
    const { testOutput, running } = this.state
    return (
      <Layout>
        <Hero pb={4} pt={4}>
          <Heading h={1}>{testName}</Heading>
          <div>
            {(running === false)
              && <Button onClick={this.startTest(testName)}>
              Start
            </Button>}
          </div>
        </Hero>
        <Container pt={3}>
          <Flex>
            <Box>
            </Box>
          </Flex>
          <Flex>
            <Box>
            <Pre>
              {testOutput}
            </Pre>
            </Box>
          </Flex>
        </Container>
      </Layout>
    )
  }
}
