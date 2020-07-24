import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Flex, Box, Label, Select } from 'ooni-components'

import { getSupportedLanguages } from '../withIntl'

export const LanguageSelector = () => {
  const intl = useIntl()
  const supportedLanguages = getSupportedLanguages()
  const languageOptions = useMemo(() => {
    return supportedLanguages.map(lang => (
      <option key={lang.code} value={lang.code}>{lang.name}</option>
    ))
  }, [supportedLanguages.length]) /* eslint-disable-line */

  return (
    <Flex flexDirection='column'>
      <Label mb={2}> Language </Label>
      <Box>
        <Select
          defaultValue={intl.locale}
          onChange={(event) => intl.setLocale(event.target.value)}
        >
          {languageOptions}
        </Select>
      </Box>
    </Flex>
  )
}
