import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Container, Text, Heading, Button, Modal } from 'ooni-components'
import styled from 'styled-components'
import { MdClose } from 'react-icons/md'

const StyledModal = styled(Modal)`
  border-radius: 8px;
  box-shadow: 4px 4px 10px black;
`

export const StyledCloseButton = styled(Box)`
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

const ConfirmationModal = ({
  show = true,
  title,
  body,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm = () => {},
  onCancel = () => {}
}) => {
  return (
    <StyledModal bg='white' show={show} color='black' onHideClick={onCancel}>
      <StyledCloseButton onClick={onCancel}><MdClose size={24} /></StyledCloseButton>
      <Container p={3}>
        <Flex flexDirection='column'>
          <Heading h={4} textAlign='center'>
            {title}
          </Heading>
          <Box my={2} px={5}>
            <Text>
              {body}
            </Text>
          </Box>
        </Flex>
      </Container>
      <Flex justifyContent='flex-end' my={3}>
        <Button mx={3} width={1/3} inverted onClick={onCancel}>
          <Text fontWeight='bold'>{cancelLabel}</Text>
        </Button>
        <Button mx={3} width={1/3} onClick={onConfirm}>
          <Text fontWeight='bold'>{confirmLabel}</Text>
        </Button>
      </Flex>
    </StyledModal>
  )
}

ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.element,
  body: PropTypes.element,
  confirmLabel: PropTypes.element,
  cancelLabel: PropTypes.element,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default ConfirmationModal
