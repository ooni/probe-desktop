import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Container, Text, Heading, Button, Modal } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { MdClose } from 'react-icons/md'

const StyledModal = styled(Modal)`
  border-radius: 8px;
  box-shadow: 4px 4px 10px black;
`

const StyledCloseButton = styled(Box)`
  position: absolute;
  top: 4px;
  right: 4px;
  height: 28px;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: ${props => props.theme.colors.gray7};

  &:hover {
    color: ${props => props.theme.colors.black};
  }
`

const StopTestModal = ({ show = true, onConfirm = () => {} , onCancel = () => {} }) => {
  return (
    <StyledModal bg='white' show={show} color='black' onHideClick={onCancel}>
      <StyledCloseButton onClick={onCancel}><MdClose size={24} /></StyledCloseButton>
      <Container p={3}>
        <Flex flexDirection='column'>
          <Text textAlign='center'>
            <Heading h={4}>
              <FormattedMessage id='Modal.InterruptTest.Title' />
            </Heading>
          </Text>
          <Box my={2} px={5}>
            <Text>
              <FormattedMessage id='Modal.InterruptTest.Paragraph' />
            </Text>
          </Box>
        </Flex>
      </Container>
      <Flex justifyContent='flex-end' my={3}>
        <Button mx={3} width={1/3} inverted onClick={onCancel}>
          <Text fontWeight='bold'><FormattedMessage id='Modal.Cancel' /></Text>
        </Button>
        <Button mx={3} width={1/3} onClick={onConfirm}>
          <Text fontWeight='bold'><FormattedMessage id='Modal.OK' /></Text>
        </Button>
      </Flex>
    </StyledModal>
  )
}

StopTestModal.propTypes = {
  show: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default StopTestModal
