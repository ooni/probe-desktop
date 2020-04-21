/* global require */
import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import osLocale from 'os-locale'

let supportedMessages = {
  en: require('../../lang/en.json')
}

const getLocale = () => {
  // fallback to en
  let navigatorLang = 'en-US'

  // If available, use locale information provided by window.navigator (chrome)
  if (typeof window !== 'undefined') {
    navigatorLang = window.navigator.userLanguage || window.navigator.language
  }

  // If found, use os-locale to detect user's system locale
  navigatorLang = osLocale.sync() || navigatorLang

  return navigatorLang.split('-')[0].split('_')[0]
}

if (typeof window !== 'undefined' && window.OONITranslations) {
  supportedMessages = window.OONITranslations
}

const withIntl = Page => {
  return class PageWithIntl extends Component {
    render() {
      const locale = getLocale()
      const now = Date.now()

      let messages = supportedMessages['en']

      if (Object.keys(supportedMessages).indexOf(locale) > -1) {
        messages = supportedMessages[locale]
      }

      return (
        <IntlProvider locale={locale} messages={messages} initialNow={now}>
          <Page {...this.props} />
        </IntlProvider>
      )
    }
  }
}

export default withIntl
