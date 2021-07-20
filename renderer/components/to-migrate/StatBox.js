import React from 'react'

import styled from 'styled-components'

import {
  Flex,
  Box
} from 'ooni-components'

export const LabelBox= styled(Box)`
  font-size: 12px;
  text-align: center;
`

const ValueBox = styled(Box)`
  font-size: 36px;
  font-weight: 300;
  text-align: center;
`

const StatBox = ({value, label, unit, ...rest}) => (
  <Flex flexDirection='column' justifyContent='space-around' style={{ height: '100%' }} {...rest}>
    {label && <LabelBox>
      {label}
    </LabelBox>}

    <ValueBox>
      {value}
    </ValueBox>

    {unit && <LabelBox>
      {unit}
    </LabelBox>}
  </Flex>
)

export default StatBox
