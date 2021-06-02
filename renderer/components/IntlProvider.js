import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'
import { getMessages, getLocale } from '../components/langUtils'
import { useConfig } from '../components/settings/useConfig'
import moment from 'moment'
// Polyfill Intl.DisplayNames to display language names in the selected language
import '@formatjs/intl-displaynames/polyfill'
require('@formatjs/intl-displaynames/locale-data/en')

// This is optional but highly recommended
// since it prevents memory leak
// https://formatjs.io/docs/react-intl/components#rawintlprovider
const cache = createIntlCache()

// All possible languages with RTL scripts
// Based on: https://github.com/shadiabuhilal/rtl-detect/blob/2eed8a33276461a24e7033d1d3a115ee64aee3f5/lib/rtl-detect.js#L138
// https://en.wikipedia.org/wiki/Script_(Unicode)
const localesWithRTL = [
  'ae',	  /* Avestan */
  'ar',   /* 'العربية', Arabic */
  'arc',  /* Aramaic */
  'bcc',  /* 'بلوچی مکرانی', Southern Balochi */
  'bqi',  /* 'بختياري', Bakthiari */
  'ckb',  /* 'Soranî / کوردی', Sorani */
  'dv',   /* Dhivehi */
  'fa',   /* 'فارسی', Persian */
  'glk',  /* 'گیلکی', Gilaki */
  'he',   /* 'עברית', Hebrew */
  'ku',   /* 'Kurdî / كوردی', Kurdish */
  'mzn',  /* 'مازِرونی', Mazanderani */
  'nqo',  /* N'Ko */
  'pnb',  /* 'پنجابی', Western Punjabi */
  'ps',   /* 'پښتو', Pashto, */
  'sd',   /* 'سنڌي', Sindhi */
  'ug',   /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
  'ur',   /* 'اردو', Urdu */
  'yi'    /* 'ייִדיש', Yiddish */
]

const IntlProvider = ({ children }) => {
  const systemLocale = getLocale()
  const [languageConfig] = useConfig('language')

  const [activeLang, activateLang] = useState(languageConfig || systemLocale || 'en')

  require(`@formatjs/intl-displaynames/locale-data/${activeLang}`)

  const messages = getMessages(activeLang)

  const intl = createIntl({ locale: activeLang, messages }, cache)

  const changeLocale = (locale) => {
    require(`@formatjs/intl-displaynames/locale-data/${locale}`)
    activateLang(locale)
    // HACK: We strip `zh-TW` to `zh` which is not recognized by momentjs
    moment.locale(locale === 'zh' ? 'zh-TW' : locale)
  }

  // Insert method to set active Locale into the intl context
  // This will be available to components via the standard `useIntl` hook
  intl['setLocale'] = changeLocale
  intl['isRTL'] = localesWithRTL.includes(activeLang)

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
