import electron from 'electron'
import React from 'react'
import Raven from 'raven-js'

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
      <Flex column>
      <Count>{testCount}</Count>
      <Unit>Tests</Unit>
      </Flex>
    </Box>
  )
}

const NetworkCount = ({networkCount}) => {
  return (
    <Box pr={2} w={1/3}>
    <Flex column>
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
    <Flex column>
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

const ErrorView = ({error}) => {
  return <div>
  <Text>{error.toString()}</Text>
  </div>
}

class Results extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      rows: [],
      testCount: -1,
      networkCount: -1,
      dataUsageUp: -1,
      dataUsageDown: -1,
      error: null
    }
  }

  componentDidMount() {
    const remote = electron.remote
    const { listResults } = remote.require('./database')
    listResults().then(results => {
      console.log(results)
      this.setState({
        loading: false,
        rows: results.rows,
        testCount: results.testCount,
        networkCount: results.networkCount,
        dataUsageUp: results.dataUsageUp,
        dataUsageDown: results.dataUsageDown,
      })
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.listResults'}})
      console.log('error triggered', err)
      this.setState({
        error: err
      })
    })
  }

  render() {
    const {
      loading,
      rows,
      networkCount,
      testCount,
      dataUsageUp,
      dataUsageDown,
      error
    } = this.state

    return (
      <Layout>
        <Sidebar currentUrl={this.props.url}>

          {!error && <div>
          {!loading && <ResultsHeader testCount={testCount} networkCount={networkCount} dataUsage={{up: dataUsageUp, down: dataUsageDown}} />}
          <Container pt={3}>
            <Text>These are the OONI Probe measurements gathered</Text>
            {loading && <Text>Loading</Text>}
            {rows.map(row => (
              <ResultRow  key={row.id} {...row} />
            ))}
          </Container>
          </div>}
          {error && <ErrorView error={error} />}

        </Sidebar>
      </Layout>
    )
  }
}

export default Results
