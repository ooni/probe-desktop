import electron from 'electron'
import React from 'react'

import Link from 'next/link'

import moment from 'moment'

import Layout from '../components/Layout'
import Sidebar from '../components/SideBar'

import styled from 'styled-components'

import {
  Button,
  Container,
  Box,
  Flex,
  Heading,
  Text
} from 'ooni-components'

const TestResult = ({result}) => {
  return <div>
  <Heading h={1}>{result.name}</Heading>
  <Text>ASN: {result.asn}</Text>
  <Text>Date: {moment(result.date).format()}</Text>
  <Text>Network: {result.network}</Text>
  <Text>Country: {result.country}</Text>
  <Text>Data Usage: {result.dataUsageUp}/{result.dataUsageDown}</Text>
  <Text>{JSON.stringify(result.summary)}</Text>
  </div>
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
          <Container pt={3}>
            <Text>These are the OONI Probe measurements gathered</Text>
            {loading && <Text>Loading</Text>}
            {results.map(result => (
              <TestResult result={result} />
            ))}
          </Container>
        </Sidebar>
      </Layout>
    )
  }
}

export default Results
