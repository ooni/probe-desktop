import React, { useState, useMemo } from 'react'
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

import styled from 'styled-components'

import { ListOption } from './widgets'
import { useConfig } from './useConfig'

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

// StyledCategoryList.displayName = 'StyledCategoryList'

const GradientBottom = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to bottom,  rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
`
// Pick category codes, names, descriptions from the intl context
const CategoryList = () => {
  const intl = useIntl()
  const categoryCodeRegex = /^CategoryCode\.(.*).Name$/
  const availableCategoryCodes = useMemo(() => Object.keys(intl.messages)
    .filter(key => key.match(categoryCodeRegex))
    .map(key => key.match(categoryCodeRegex)[1])
    .sort()
    , [])

  return (
    <ListOption optionKey='nettests.websites_enabled_category_codes'>
      {(list, handleChange) => {
        return (
          <StyledCategoryList>
            {availableCategoryCodes.map(code => (
              <CategoryEntry
                key={code}
                code={code}
                enabled={list.indexOf(code) > -1}
                handleChange={handleChange}
              />
            ))}
            <GradientBottom />
          </StyledCategoryList>
        )
      }}
    </ListOption>
  )
}

export const WebsiteCategoriesSelector = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [categoryList, setCategoryList] = useConfig('nettests.websites_enabled_category_codes')

  const intl = useIntl()
  const categoryCodeRegex = /^CategoryCode\.(.*).Name$/
  const availableCategoryCodes = useMemo(() => Object.keys(intl.messages)
    .filter(key => key.match(categoryCodeRegex))
    .map(key => key.match(categoryCodeRegex)[1])
    .sort()
    , [])

  return (
    <Flex flexDirection='column'>
      <Label my={1}><FormattedMessage id='Settings.Websites.Categories.Label' /></Label>
      <Text my={1} fontSize='90%' color='gray8'>
        <FormattedMessage
          id='Settings.Websites.Categories.Description'
          values={{
            Count: categoryList.length
          }}
        />
      </Text>
      <Box mt={1} mb={2} width={2/3}>
        <Button fontSize={14} hollow onClick={() => setModalOpen(!modalOpen)}>Edit</Button>
      </Box>
      <Modal width='60%' show={modalOpen} closeButton='right' onHideClick={() => setModalOpen(false)}>
        <Container>
          <Heading h={4} my={3} textAlign='center'>
            <FormattedMessage id='Settings.Websites.Categories.Label' />
          </Heading>
          <CategoryList />
          <Flex justifyContent='flex-end' my={3}>
            <Button ml={2} inverted onClick={() => setCategoryList([])}>
              <strong>Deselect all</strong>
            </Button>
            <Button ml={2} inverted onClick={() => setCategoryList(availableCategoryCodes)}>
              <strong>Select all</strong>
            </Button>
            <Button ml={2} onClick={() => setModalOpen(false)}>
              <strong>Done</strong>
            </Button>
          </Flex>
        </Container>
      </Modal>
    </Flex>
  )
}
