import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import { getMessages, getLocale, getSupportedLanguages } from '../components/langUtils'
import { useConfig } from '../components/settings/useConfig'

// Polyfill Intl.DisplayNames to display language names in the selected language
import '@formatjs/intl-displaynames/polyfill'
getSupportedLanguages().forEach(lang => {
  require(`@formatjs/intl-displaynames/locale-data/${lang}`)
})

// This is optional but highly recommended
// since it prevents memory leak
// https://formatjs.io/docs/react-intl/components#rawintlprovider
const cache = createIntlCache()

const IntlProvider = ({ children }) => {
  const systemLocale = getLocale()
  const [languageConfig] = useConfig('language')

  const [activeLang, activateLang] = useState(languageConfig || systemLocale || 'en')

  const messages = getMessages(activeLang)

  const intl = createIntl({ locale: activeLang, messages }, cache)

  const changeLocale = (locale => {
    activateLang(locale)
  })

  // Insert method to set active Locale into the intl context
  // This will be available to components via the standard `useIntl` hook
  intl['setLocale'] = changeLocale

  return (
    <RawIntlProvider value={intl}>
      {children}
    </RawIntlProvider>
  )
}

IntlProvider.propTypes = {
  children: PropTypes.any
}

export default IntlProvider
