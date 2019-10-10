/* global require */
import React, {Component} from 'react'
import { IntlProvider, addLocaleData, injectIntl } from 'react-intl'

let supportedMessages = {
  en: require('../../lang/en.json')
}

const getLocale = () => {
  let navigatorLang = 'en-US'
  if (typeof window !== 'undefined') {
    navigatorLang = window.navigator.userLanguage || window.navigator.language
  }
  return navigatorLang.split('-')[0]
}

if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach((lang) => {
    // addLocaleData(window.ReactIntlLocaleData[lang])
  })
}

if (typeof window !== 'undefined' && window.OONITranslations) {
  supportedMessages = window.OONITranslations
}

const withIntl = (Page) => {
  const IntlPage = injectIntl(Page)

  return class PageWithIntl extends Component {
    render () {
      const locale = getLocale()
      const now = Date.now()

      let messages = supportedMessages['en']
      if (supportedMessages[locale] !== null) {
        messages = supportedMessages[locale]
      }

      return (
        <IntlProvider locale={locale} messages={messages} initialNow={now}>
          <IntlPage {...this.props} />
        </IntlProvider>
      )
    }
  }
}

export default withIntl
