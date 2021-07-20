import React, { useMemo, useCallback } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Flex, Box, Label, Select } from 'ooni-components'

import { getSupportedLanguages } from '../langUtils'
import { useConfig } from './useConfig'

export const LanguageSelector = () => {
  const intl = useIntl()
  const [, setLangugageConfig] = useConfig('language')

  const supportedLanguages = getSupportedLanguages()
  const languageOptions = useMemo(() => {
    return supportedLanguages
      .sort((langA) => langA == 'en' ? -1 : 0)
      .map(lang => (
        <option key={lang} value={lang}>{intl.formatDisplayName(lang)}</option>
      ))
  }, [intl.locale]) /* eslint-disable-line */

  const onChange = useCallback((event) => {
    intl.setLocale(event.target.value)
    setLangugageConfig(event.target.value)
  }, [intl, setLangugageConfig])

  return (
    <Flex flexDirection='column'>
      <Label mb={2}> <FormattedMessage id='Settings.Language.Label' /></Label>
      <Box>
        <Select
          defaultValue={intl.locale}
          onChange={onChange}
          data-testid='select-language'
        >
          {languageOptions}
        </Select>
      </Box>
    </Flex>
  )
}
