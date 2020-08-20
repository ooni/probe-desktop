import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { Flex, Box, Label, Select } from 'ooni-components'

import { getSupportedLanguages } from '../langUtils'

export const LanguageSelector = () => {
  const intl = useIntl()
  const supportedLanguages = getSupportedLanguages()
  const languageOptions = useMemo(() => {
    console.log(`Genearating langOpts again for ${intl.locale}`)
    return supportedLanguages.map(lang => (
      <option key={lang} value={lang}>{intl.formatDisplayName(lang)}</option>
    ))
  }, [intl.locale]) /* eslint-disable-line */

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
