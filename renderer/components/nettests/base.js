import React from 'react'

import styled from 'styled-components'

import moment from 'moment'

import MdInfo from 'react-icons/lib/md/info'

import {
  Button,
  Container,
  Box,
  Flex,
  Heading,
  Text,
  Divider
} from 'ooni-components'

const TestName = styled.span`
  font-size: 18px;
  font-weight: 600;
`

const NetworkName = styled.span`
  font-size: 20px;
`

const Location = styled.span`
  font-size: 14px;
`

const Date = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.gray5};
  padding-left: 8px;
`

export class ResultRow extends React.Component {
  constructor (props) {
    super(props)
  }

  renderIcon() {
    return <MdInfo size={60} />
  }

  renderSummary(summary) {
    return <Text>
    {JSON.stringify(summary, null, ' ')}
    </Text>
  }

  render() {
    const {
      name,
      asn,
      date,
      network,
      country,
      dataUsageDown,
      dataUsageUp,
      summary
    } = this.props
    return <div>
    <Flex center pt={2} pb={2}>
      <Box pr={2} w={1/7}>
        {this.renderIcon()}
      </Box>
      <Box pr={2}>
        <Flex column>
        <Box pr={4} w={3/7}>
          <TestName>{name}</TestName>
        </Box>
        <Box>
          <NetworkName>{network}</NetworkName>
        </Box>
        <Box>
        <Location>{asn} ({country})</Location>
        <Date>{moment(date).format('ll')}</Date>
        </Box>
        </Flex>
      </Box>
      <Box w={3/7}>
      {this.renderSummary(summary)}
      </Box>
    </Flex>
    <Divider />
    </div>
  }
}
