import React from 'react'

import styled from 'styled-components'

import moment from 'moment'

import {
  theme,
  Box,
  Flex,
  Text,
  Divider
} from 'ooni-components'

import Link from 'next/link'

import { testGroups } from '../test-info'
import RightArrow from '../RightArrow'

const ColorCode = styled.div`
  height: 80px;
  width: 5px;
  margin-right: 10px;
  margin-top: 1px;
  margin-bottom: 1px;
  background-color: ${props => props.color};
`

const BorderedRow = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

const VerticalCenter = ({children}) => {
  return (
    <Flex justify='center' align='center' style={{height: '100%'}}>
      <Box>
        {children}
      </Box>
    </Flex>
  )
}

class ResultRow extends React.Component {
  constructor (props) {
    super(props)
  }

  renderIcon() {
    const { name } = this.props

    const group = testGroups[name]

    return (
      <Flex justify='center' align='center'>
        <Box w={1/8}>
          <ColorCode color={group.color} />
        </Box>
        <Box w={7/8}>
          <Flex>
            <Box pr={2}>
              {React.cloneElement(
                group.icon,
                {size: 20, color: group.color}
              )}
            </Box>
            <Box>
              <Text color={group.color} bold>{group.name}</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    )
  }

  renderNetwork() {
    const {
      asn,
      network,
      country
    } = this.props

    return (
      <VerticalCenter>
        <Text>{network}</Text>
        <Text>AS{asn} ({country})</Text>
      </VerticalCenter>
    )
  }

  renderDate() {
    const {
      start_time
    } = this.props

    return (
      <VerticalCenter>
        <Text>{moment(start_time).format('HH:mm Do MMM')}</Text>
      </VerticalCenter>
    )
  }
  renderSummary() {
    const {
      name,
      summary
    } = this.props

    const group = testGroups[name]

    const summaryObj = JSON.parse(summary)

    return <VerticalCenter>
      {group.renderSummary(summaryObj)}
    </VerticalCenter>
  }

  render() {
    const {
      resultID
    } = this.props
    return <BorderedRow>
      <Flex>
        <Box pr={2} w={3/16}>
          {this.renderIcon()}
        </Box>
        <Box w={3/16} h={1}>
          {this.renderNetwork()}
        </Box>
        <Box pr={3/16}>
          {this.renderDate()}
        </Box>
        <Box w={5/16}>
          {this.renderSummary()}
        </Box>
        <Box w={1/6} style={{marginLeft: 'auto'}}>
          <VerticalCenter>
            <Link href={{ pathname: '/results', query: {resultID} }} passHref>
              <a>
                <RightArrow />
              </a>
            </Link>
          </VerticalCenter>
        </Box>
      </Flex>
    </BorderedRow>
  }
}

export default ResultRow
