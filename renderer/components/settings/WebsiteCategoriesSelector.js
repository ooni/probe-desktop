import React, { useState, useMemo, useCallback } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Flex, Box,
  Label,
  Button,
  Text,
  Modal,
  Container,
  Heading
} from 'ooni-components'
import * as CategoryIcons from 'ooni-components/dist/icons'
import { MdClose } from 'react-icons/md'
import styled from 'styled-components'

import { useConfig } from './useConfig'
import ConfirmationModal, { StyledCloseButton } from '../ConfirmationModal'

const FlexWithBottomBorder = styled(Flex)`
  border-bottom: 1px solid ${props => props.theme.colors.gray5};
`

const CategoryEntry = ({ code, enabled, handleChange }) => {
  const CategoryIcon = CategoryIcons.hasOwnProperty(`CategoryCode${code}`) ? (
    CategoryIcons[`CategoryCode${code}`]
  ) : (
    CategoryIcons['Cross']
  )

  return (
    <FlexWithBottomBorder alignItems='center' py={3}>
      <input type='checkbox' id={code} name={code} checked={enabled} onChange={handleChange}/>
      <Label htmlFor={code}>
        <Box ml={2}>
          <Text fontSize={1}><FormattedMessage id={`CategoryCode.${code}.Name`} /></Text>
          <Text fontSize={14} color='gray8' my={2}><FormattedMessage id={`CategoryCode.${code}.Description`} /></Text>
        </Box>

      </Label>
      <Box ml='auto'>
        <CategoryIcon size={48} />
      </Box>
    </FlexWithBottomBorder>
  )
}

const StyledCategoryList = styled(Box)`
  height: 60vh;
  overflow-y: scroll;
  position: relative;
`

// Pick category codes, names, descriptions from the intl context
const CategoryList = ({ initialList, handleChange }) => {
  return (
    <StyledCategoryList>
      {Object.entries(initialList).map(([code, enabled]) => (
        <CategoryEntry
          key={code}
          code={code}
          enabled={enabled}
          handleChange={handleChange}
        />
      ))}
    </StyledCategoryList>
  )
}

export const WebsiteCategoriesSelector = () => {
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [categoryListInConfig, setCategoryListInConfig] = useConfig('nettests.websites_enabled_category_codes')
  const [selectedCategoryCodes, setSelectedCategoryCodes] = useState(categoryListInConfig)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const enabledCategoriesCount = Object.values(categoryListInConfig).reduce((count, enabled) => {
    return count + (enabled ? 1 : 0)
  }, 0)

  const isNotDirty = useMemo(() => {
    const selectedKeys = Object.keys(selectedCategoryCodes)
    const keysInConfig = Object.keys(categoryListInConfig)

    if (selectedKeys.length !== keysInConfig.length) {
      return false
    }

    for (let key of selectedKeys) {
      if (selectedCategoryCodes[key] !== categoryListInConfig[key]) {
        return false
      }
    }
    return true
  }, [selectedCategoryCodes, categoryListInConfig])

  const collectChange = useCallback((event) => {
    setSelectedCategoryCodes({...selectedCategoryCodes, [event.target.name]: event.target.checked})
  }, [selectedCategoryCodes, setSelectedCategoryCodes])

  const selectAll = useCallback((operation) => {
    const updatedList = Object.keys(selectedCategoryCodes).reduce((updatedList, code) => {
      updatedList[code] = operation
      return updatedList
    }, {})
    setSelectedCategoryCodes(updatedList)
  }, [selectedCategoryCodes, setSelectedCategoryCodes])

  const onClose = useCallback(() => {
    if (isNotDirty) {
      setShowCategoriesModal(false)
    } else {
      setShowConfirmation(true)
    }
  }, [setShowConfirmation, setShowCategoriesModal, isNotDirty])

  const onConfirm = useCallback(() => {
    setCategoryListInConfig(selectedCategoryCodes)
    setShowConfirmation(false)
    setShowCategoriesModal(false)
  }, [selectedCategoryCodes, setCategoryListInConfig, setShowCategoriesModal])

  const onDiscard = useCallback(() => {
    setSelectedCategoryCodes(categoryListInConfig)
    setShowConfirmation(false)
    setShowCategoriesModal(false)
  }, [categoryListInConfig, setSelectedCategoryCodes, setShowConfirmation, setShowCategoriesModal])

  return (
    <Flex flexDirection='column'>
      <Label my={1}><FormattedMessage id='Settings.Websites.Categories.Label' /></Label>
      <Text my={1} fontSize='90%' color='gray8'>
        <FormattedMessage
          id='Settings.Websites.Categories.Description'
          values={{
            Count: enabledCategoriesCount
          }}
        />
      </Text>
      <Box mt={1} mb={2} width={2/3}>
        <Button fontSize={14} hollow onClick={() => setShowCategoriesModal(!showCategoriesModal)}>
          Edit
        </Button>
      </Box>
      <Modal width='60%' show={showCategoriesModal}>
        <StyledCloseButton onClick={() => onClose()}><MdClose size={24} /></StyledCloseButton>
        <Container>
          <Heading h={4} my={3} textAlign='center'>
            <FormattedMessage id='Settings.Websites.Categories.Label' />
          </Heading>
          <CategoryList initialList={selectedCategoryCodes} handleChange={collectChange} />
          <Flex justifyContent='flex-end' my={3}>
            <Button ml={2} inverted onClick={() => selectAll(false)}>
              <strong><FormattedMessage id='Settings.Websites.Categories.Selection.None' /></strong>
            </Button>
            <Button ml={2} inverted onClick={() => selectAll(true)}>
              <strong><FormattedMessage id='Settings.Websites.Categories.Selection.All' /></strong>
            </Button>
            <Button ml={2} disabled={isNotDirty} onClick={() => onConfirm()}>
              <strong><FormattedMessage id='Settings.Websites.Categories.Selection.Done' /></strong>
            </Button>
          </Flex>
        </Container>
      </Modal>
      {showConfirmation &&
        <ConfirmationModal
          show={showConfirmation}
          title={<FormattedMessage id='Settings.Websites.Categories.Confirmation.Title' />}
          body={<FormattedMessage id='Settings.Websites.Categories.Confirmation.Body' />}
          confirmLabel={<FormattedMessage id='Settings.Websites.Categories.Confirmation.Label.Confirm' />}
          cancelLabel={<FormattedMessage id='Settings.Websites.Categories.Confirmation.Label.Cancel' />}
          onConfirm={onConfirm}
          onCancel={() => onDiscard()}
        />
      }
    </Flex>
  )
}
