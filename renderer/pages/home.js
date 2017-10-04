import React from 'react'

import Link from 'next/link'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'

import styled from 'styled-components'

import MdWeb from 'react-icons/lib/md/web'
import MdChat from 'react-icons/lib/md/chat'
import MdComputer from 'react-icons/lib/md/computer'

import IoSpeedometer from 'react-icons/lib/io/speedometer'

import {
  Button,
  Container,
  Box,
  Flex,
  Heading,
  Text
} from 'ooni-components'

// XXX these should all go into components
const testList  = [
    {
      name: 'Web Censorship',
      icon: <MdWeb size={100} />
    },
    {
      name: 'IM App Censorship',
      icon: <MdChat size={100} />
    },
    {
      name: 'Performance & Net Neutrality',
      icon: <IoSpeedometer size={100} />
    },

    {
      name: 'Middle box detection',
      icon: <MdComputer size={100} />
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

const RunTestCard = ({name, icon}) => (
  <Box w={[1/2]}>
    <Flex align='center'>
      <Box>
      <StyledRunTestCard>
        {icon}
        <Text>{name}</Text>
      </StyledRunTestCard>
      </Box>
    </Flex>
  </Box>
)

class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <Container pt={3} pb={3}>
            <Flex>
              <Box w={[1/2]}>
                <Heading h={1}>Network info</Heading>
                <Text>Type: WiFi</Text>
                <Text>Name: Vodafone Italia</Text>
                <Text>Country: Italy</Text>
              </Box>
              <Box w={[1/2]}>
                <Heading h={1}>Stats</Heading>
                <Text>Tests run: 100000</Text>
                <Text>Networks tested: 20</Text>
                <Text>Countries tested: 2</Text>
              </Box>
            </Flex>

            <Heading h={1}>Pick a test</Heading>
            <Flex wrap>
              {testList.map((t) => <RunTestCard name={t.name} icon={t.icon} /> )}
            </Flex>
          </Container>
        </Sidebar>
      </Layout>
    )
  }
}

export default Home
