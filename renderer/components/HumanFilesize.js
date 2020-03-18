import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import humanize from 'humanize'

import {
  Flex
} from 'ooni-components'

const FileUnit = styled.span`
  font-size: ${props => props.fontSize/2}px;
`

const FileAmount = styled.span`
  font-size: ${props => props.fontSize}px;
  font-weight: 300;
`

const HumanFilesize = ({icon, size, fontSize}) => {
  const human = humanize.filesize(size)
  const [amount, unit] = human.split(' ')
  return (
    <Flex alignItems='baseline'>
      {icon}
      <FileAmount fontSize={fontSize}>{amount}</FileAmount>
      <FileUnit fontSize={fontSize}>{unit}</FileUnit>
    </Flex>
  )
}

HumanFilesize.propTypes = {
  size: PropTypes.number.isRequired,
  icon: PropTypes.element,
  fontSize: PropTypes.number.isRequired
}

HumanFilesize.defaultProps = {
  fontSize: 36
}

export default HumanFilesize
