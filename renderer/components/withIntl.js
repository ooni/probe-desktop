/* global require */
import React, {Component} from 'react'
import { IntlProvider, injectIntl } from 'react-intl'

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

if (typeof window !== 'undefined' && window.OONITranslations) {
  supportedMessages = window.OONITranslations
}

const withIntl = (Page) => {
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
          <Page {...this.props} />
        </IntlProvider>
      )
    }
  }
}

export default withIntl
