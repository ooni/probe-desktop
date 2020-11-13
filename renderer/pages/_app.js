import React, { useState, useEffect } from 'react'
import * as Sentry from '@sentry/node'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import { getMessages, getLocale, getSupportedLanguages } from '../components/langUtils'

// Polyfill Intl.DisplayNames to display language names in the selected language
import '@formatjs/intl-displaynames/polyfill'
getSupportedLanguages().forEach(lang => {
  require(`@formatjs/intl-displaynames/locale-data/${lang}`)
})

// This is optional but highly recommended
// since it prevents memory leak
// https://formatjs.io/docs/react-intl/components#rawintlprovider
const cache = createIntlCache()

Sentry.init({
  dsn: 'https://e1eef2aaa6054d94bffc4a648fb78f09@sentry.io/1210892',
})

const MyApp = ({ Component, pageProps, err }) => {

  // Workaround for https://github.com/zeit/next.js/issues/8592
  const modifiedPageProps = { ...pageProps, err }

  const systemLocale = getLocale()

  const [activeLang, activateLang] = useState(systemLocale)

  const messages = getMessages(activeLang)

  const intl = createIntl({ locale: activeLang, messages }, cache)

  // Insert method to set active Locale into the intl context
  // This will be available to components via the standard `useIntl` hook
  intl['setLocale'] = activateLang

  return (
    <RawIntlProvider value={intl}>
      <Component {...modifiedPageProps} />
    </RawIntlProvider>
  )
}

export default MyApp
