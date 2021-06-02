import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box } from 'ooni-components'

const StepperCircle = styled(Box)`
  background-color: ${props => props.active ? props.theme.colors.white : props.theme.colors.blue5};
  width: 15px;
  height: 15px;
  border-radius: 15px;
`

const StepperLine = styled(Box)`
  background-color: ${props => props.active ? props.theme.colors.white : props.theme.colors.blue5};
  width: 50px;
  height: 3px;
`

const Stepper = ({activeIdx}) => {
  return (
    <Flex justifyContent='center' alignItems='center'>
      <StepperCircle active={true} />
      <StepperLine active={activeIdx > 0} />
      <StepperCircle active={activeIdx > 0} />
      <StepperLine active={activeIdx > 1} />
      <StepperCircle active={activeIdx > 1} />
      <StepperLine active={activeIdx > 2} />
      <StepperCircle active={activeIdx > 2} />
    </Flex>
  )
}

Stepper.propTypes = {
  activeIdx: PropTypes.number.isRequired
}

export default Stepper
