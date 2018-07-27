import React from 'react'

import Layout from '../components/Layout'

import styled from 'styled-components'

import {
  Text,
  Button,
  Box,
  Flex,
  Heading
} from 'ooni-components'

const TopBar = styled.div`
  height: 50px;
  background-color: ${props => props.theme.colors.gray5};
  color: ${props => props.theme.colors.white};
  /* This makes it possible to drag the window around from the side bar */
  -webkit-app-region: drag;
`

const SectionContainer = styled.div`
  min-height: 100%;
  width: 100%;
  background-color: ${props => props.theme.colors.blue6};
  color: ${props => props.theme.colors.white};
`

const SectionThingsToKnow = () => (
  <Flex w={1}>
    <Box w={1}>
      <Heading center h={1}>Things to know</Heading>
    </Box>
  </Flex>
)

const SectionWhatIsOONI = ({onNext}) => (
  <Flex wrap>
    <Box w={1} p={2}>
      <Heading center h={1}>What is OONI?</Heading>
    </Box>
    <Box w={1} p={4}>
      <Text>Pariatur Open Observatory of Network Interference, incididunt, TCP
      internet network interference consequat ullamco tempor cupidatat ipsum
      network interference ex. Non in UDP surveillance, eiusmod aliquip TLS
      handshake network interference traffic manipulation Open Observatory of
      Network Interference UDP Tor censorship TLS handshake. Occaecat Open
      Observatory of Network Interference, traffic manipulation qui sint
      censorship DNS tampering DNS tampering connection reset UDP. In velit do
      cillum internet TCP, occaecat consectetur ullamco middlebox network
      interference tempor UDP voluptate surveillance. Esse, deserunt sed
      censorship traffic manipulation middlebox consectetur.
      </Text>
    </Box>
    <Box style={{'margin': '0 auto'}}>
      <Button inverted onClick={onNext}>
      Continue
      </Button>
    </Box>
  </Flex>
)

class Sections extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeIdx: 0
    }
    this.nextStep = this.nextStep.bind(this)
    this.prevStep = this.prevStep.bind(this)
  }

  nextStep() {
    if (this.state.activeStep >= this.props.numSteps) {
      return
    }

    this.setState({
      activeIdx: this.state.activeIdx + 1
    })
  }

  prevStep() {
    if (this.state.activeIdx <= 0) {
      return
    }

    this.setState({
      activeIdx: this.state.activeIdx - 1
    })
  }

  render() {
    const {
      activeIdx
    } = this.state

    return (
      <div>
        {activeIdx === 0 && <SectionWhatIsOONI onNext={this.nextStep} />}
        {activeIdx === 1 && <SectionThingsToKnow />}
        <Button inverted onClick={this.prevStep}>
        Back
        </Button>
      </div>
    )
  }
}

const Onboard = () => (
  <Layout>
    <SectionContainer>
      <TopBar />
      <Sections numSteps={3} />
    </SectionContainer>
  </Layout>
)

export default Onboard
