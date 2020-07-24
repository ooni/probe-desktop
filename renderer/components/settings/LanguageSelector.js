import React from 'react'
import { useIntl } from 'react-intl'
import { Flex, Box, Label, Select } from 'ooni-components'

export const LanguageSelector = () => {
  const intl = useIntl()

  // Don't render the language selector if there is no setLocale in the context
  if (!intl.hasOwnProperty('setLocale')) {
    return <div />
  }

  return (
    <Flex flexDirection='column'>
      <Label mb={2}> Language </Label>
      <Box>
        <Select onChange={(event) => intl.setLocale(event.target.value)}>
          <option value='en'>English</option>
          <option value='it'>Italiano</option>
        </Select>
      </Box>
    </Flex>
  )
}
