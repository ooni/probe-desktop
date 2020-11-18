import React, { useMemo } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Flex, Box, Label, Select } from 'ooni-components'

import { getSupportedLanguages } from '../langUtils'

export const LanguageSelector = () => {
  const intl = useIntl()
  const supportedLanguages = getSupportedLanguages()
  const languageOptions = useMemo(() => {
    return supportedLanguages
      .sort((langA) => langA == 'en' ? -1 : 0)
      .map(lang => (
        <option key={lang} value={lang}>{intl.formatDisplayName(lang)}</option>
      ))
  }, [intl.locale]) /* eslint-disable-line */

  return (
    <Flex flexDirection='column'>
      <Label mb={2}> <FormattedMessage id='Settings.Language.Label' /></Label>
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
