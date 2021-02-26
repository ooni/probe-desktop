import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Modal, Container, Flex, Button, Heading, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdClose } from 'react-icons/md'
import { ipcRenderer } from 'electron'

import { StyledCloseButton } from './ConfirmationModal'
import FormattedMarkdownMessage from './FormattedMarkdownMessage'

const AutorunConfirmation = ({ show, onClose }) => {
  const onConfirm = useCallback(() => {
    ipcRenderer.invoke('autorun.schedule')
    onClose()
  }, [])
  const onRemindLater = useCallback(() => {
    ipcRenderer.send('autorun.remind-later')
    onClose()
  }, [])
  const onCancel = useCallback(() => {
    onClose()
  }, [])
  return (
    <Modal width='60%' show={show}>
      <StyledCloseButton onClick={onClose}><MdClose size={24} /></StyledCloseButton>
      <Container>
        <Heading h={4} my={3} textAlign='center'>
          <FormattedMessage id='AutomaticTest.Modal.Title' />
        </Heading>
        <Flex>
          <Text><FormattedMarkdownMessage id='AutomaticTest.Modal.Text' /></Text>
        </Flex>
        <Flex justifyContent='flex-end' my={3}>
          <Button ml={2} inverted onClick={onCancel}>
            <strong><FormattedMessage id='AutomaticTest.Modal.Button.No' /></strong>
          </Button>
          <Button ml={2} inverted onClick={onRemindLater}>
            <strong><FormattedMessage id='AutomaticTest.Modal.Button.RemindLater' /></strong>
          </Button>
          <Button ml={2} onClick={onConfirm}>
            <strong><FormattedMessage id='AutomaticTest.Modal.Button.Yes' /></strong>
          </Button>
        </Flex>
      </Container>
    </Modal>
  )
}

AutorunConfirmation.propTypes = {
  onClose: PropTypes.func,
  show: PropTypes.bool.isRequired
}

export default AutorunConfirmation