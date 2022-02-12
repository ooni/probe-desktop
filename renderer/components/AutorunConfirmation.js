import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Modal, Container, Flex, Button, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdClose } from 'react-icons/md'
import { ipcRenderer } from 'electron'

import { StyledCloseButton } from './ConfirmationModal'
import FormattedMarkdownMessage from './FormattedMarkdownMessage'

const AutorunConfirmation = ({ show, onClose }) => {
  const onConfirm = useCallback(() => {
    ipcRenderer.invoke('autorun.schedule')
    onClose()
  }, [onClose])
  const onRemindLater = useCallback(() => {
    ipcRenderer.send('autorun.remind-later')
    onClose()
  }, [onClose])
  const onCancel = useCallback(() => {
    ipcRenderer.send('autorun.cancel')
    onClose()
  }, [onClose])
  return (
    <Modal width='60%' show={show}>
      <StyledCloseButton onClick={onClose}><MdClose size={24} /></StyledCloseButton>
      <Container data-testid='modal-autorun-confirmation'>
        <Heading h={4} my={3} textAlign='center' data-testid='heading-autorun-confirmation'>
          <FormattedMessage id='Modal.Autorun.Modal.Title' />
        </Heading>
        <Flex data-testid='text-autorun-confirmation'>
          <FormattedMarkdownMessage id='Modal.Autorun.Modal.Text' />
        </Flex>
        <Flex justifyContent='flex-end' my={3}>
          <Button ml={2} inverted onClick={onCancel} data-testid='button-autorun-no'>
            <strong><FormattedMessage id='Modal.NoThanks' /></strong>
          </Button>
          <Button ml={2} inverted onClick={onRemindLater} data-testid='button-autorun-remind-later'>
            <strong><FormattedMessage id='Modal.Autorun.Modal.Button.RemindLater' /></strong>
          </Button>
          <Button ml={2} onClick={onConfirm} data-testid='button-autorun-yes'>
            <strong><FormattedMessage id='Modal.SoundsGreat' /></strong>
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
