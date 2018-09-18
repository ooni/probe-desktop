import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import humanize from 'humanize'

import {
  Box
} from 'ooni-components'

const FileUnit = styled.span`
  font-size: ${props => props.fontSize/2}px;
`

const FileAmount = styled.span`
  font-size: ${props => props.fontSize}px;
  font-weight: 300;
`

const StyledHumanFilesize = styled(Box)`
  padding: 0px;
  text-align: center;
`

const HumanFilesize = ({icon, size, fontSize}) => {
  const human = humanize.filesize(size)
  const [amount, unit] = human.split(' ')
  return (
    <StyledHumanFilesize>
      {icon}
      <FileAmount fontSize={fontSize}>{amount}</FileAmount>
      <FileUnit fontSize={fontSize}>{unit}</FileUnit>
    </StyledHumanFilesize>
  )
}

HumanFilesize.propTypes = {
  size: PropTypes.number.isRequired,
  icon: PropTypes.element,
  fontSize: PropTypes.number.isRequired
}

HumanFilesize.defaultProps = {
  fontSize: 24
}

export default HumanFilesize
