import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Modal, Container, Flex, Button, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdClose } from 'react-icons/md'

import { StyledCloseButton } from './ConfirmationModal'
import FormattedMarkdownMessage from './FormattedMarkdownMessage'

const AutorunConfirmation = ({ show, onClose }) => {
  const onConfirm = useCallback(() => {
    window.electron.autorun.schedule()
    onClose()
  }, [onClose])
  const onRemindLater = useCallback(() => {
    window.electron.autorun.remindLater()
    onClose()
  }, [onClose])
  const onCancel = useCallback(() => {
    window.electron.autorun.cancel()
    onClose()
  }, [onClose])
  return (
    <Modal width='60%' show={show}>
      <StyledCloseButton onClick={onClose}><MdClose size={24} /></StyledCloseButton>
      <Container>
        <Heading h={4} my={3} textAlign='center'>
          <FormattedMessage id='Modal.Autorun.Modal.Title' />
        </Heading>
        <Flex>
          <FormattedMarkdownMessage id='Modal.Autorun.Modal.Text' />
        </Flex>
        <Flex justifyContent='flex-end' my={3}>
          <Button ml={2} inverted onClick={onCancel}>
            <strong><FormattedMessage id='Modal.NoThanks' /></strong>
          </Button>
          <Button ml={2} inverted onClick={onRemindLater}>
            <strong><FormattedMessage id='Modal.Autorun.Modal.Button.RemindLater' /></strong>
          </Button>
          <Button ml={2} onClick={onConfirm}>
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
