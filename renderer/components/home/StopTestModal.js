import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Box, Container, Text, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import { Modal, YesButton, NoButton } from '../Modal'

const StopTestModal = ({ show = true, onConfirm = () => {} , onCancel = () => {} }) => {
  return (
    <Modal show={show}>
      <Container p={3}>
        <Flex flexDirection='column'>
          <Text textAlign='center'>
            <Heading h={5}>
              <FormattedMessage id='Modal.InterruptTest.Title' />
            </Heading>
          </Text>
          <Box my={2}>
            <Text>
              <FormattedMessage id='Modal.InterruptTest.Paragraph' />
            </Text>
          </Box>
        </Flex>
      </Container>
      <Flex>
        <YesButton width={1/2} onClick={onConfirm}>
          <FormattedMessage id='Modal.OK' />
        </YesButton>
        <NoButton width={1/2} onClick={onCancel}>
          <FormattedMessage id='Modal.Cancel' />
        </NoButton>
      </Flex>
    </Modal>
  )
}

StopTestModal.propTypes = {
  show: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default StopTestModal
