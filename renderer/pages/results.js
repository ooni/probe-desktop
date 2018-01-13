import electron from 'electron'
import React from 'react'

import Link from 'next/link'

import moment from 'moment'
import humanize from 'humanize'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'
import { ResultRow } from '../components/nettests/base'

import styled from 'styled-components'

import {
  Button,
  Container,
  Box,
  Flex,
  Heading,
  Text
} from 'ooni-components'

const Count = styled(Box)`
text-align: center;
font-size: 42px;
font-weight: 300;
`

const Unit = styled(Box)`
text-align: center;
font-size: 16px;
`

const TestCount = ({testCount}) => {
  return (
    <Box pr={2} w={1/3}>
      <Flex center column>
      <Count>{testCount}</Count>
      <Unit>Tests</Unit>
      </Flex>
    </Box>
  )
}

const NetworkCount = ({networkCount}) => {
  return (
    <Box pr={2} w={1/3}>
    <Flex center column>
    <Count>{networkCount}</Count>
    <Unit>Networks</Unit>
    </Flex>
    </Box>
  )
}

const FileUnit = styled.span`
  font-size: 14px;
`

const FileAmount = styled.span`
  font-size: 24px;
  font-weight: 300;
`

const StyledHumanFilesize = styled(Box)`
  padding: 0px;
  text-align: center;
`

const HumanFilesize = ({size}) => {
  const human = humanize.filesize(size)
  const [amount, unit] = human.split(' ')
  return (
    <StyledHumanFilesize>
      <FileAmount>{amount}</FileAmount>
      <FileUnit>{unit}</FileUnit>
    </StyledHumanFilesize>
  )
}
const DataUsage = ({dataUsage}) => {
  return (
    <Box pr={2} w={1/3}>
    <Flex center column>
    <Box>
      <Flex column>
        <HumanFilesize size={dataUsage.up} />
        <HumanFilesize size={dataUsage.down} />
      </Flex>
    </Box>
    <Unit>Data</Unit>
    </Flex>
    </Box>
  )
}

const StyledResultsHeader = styled.div`
  background-color: ${props => props.theme.colors.blue5};
  color: ${props => props.theme.colors.white};
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
`

const ResultsHeader = ({testCount, networkCount, dataUsage}) => {
  return (
    <StyledResultsHeader>
      <Flex align='baseline' justify='space-around'>
      <Box w={2/3}>
        <Flex>
        <TestCount testCount={testCount} />
        <NetworkCount networkCount={networkCount} />
        <DataUsage dataUsage={dataUsage} />
        </Flex>
      </Box>
      </Flex>
    </StyledResultsHeader>
  )
}

class Results extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      results: []
    }
  }

  componentDidMount() {
    const remote = electron.remote
    const { listResults } = remote.require('./utils/ooni/list')
    listResults().then(results => {
      this.setState({
        loading: false,
        results
      })
    })
  }

  render() {
    const {
      loading,
      results
    } = this.state

    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>
          <ResultsHeader testCount={42} networkCount={2} dataUsage={{up: 1024*23, down: 1024*21}} />
          <Container pt={3}>
            <Text>These are the OONI Probe measurements gathered</Text>
            {loading && <Text>Loading</Text>}
            {results.map(result => (
              <ResultRow  {...result} />
            ))}
          </Container>
        </Sidebar>
      </Layout>
    )
  }
}

export default Results
