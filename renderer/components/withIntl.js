/* global require */
import osLocale from 'os-locale'

export const getMessages = (locale = null) => {
  let supportedMessages = {
    en: require('../../lang/en.json')
  }

  if (typeof window !== 'undefined' && window.OONITranslations) {
    supportedMessages = window.OONITranslations
  }

  if (supportedMessages.hasOwnProperty(locale)) {
    const mergedMessages = Object.assign(
      {},
      process.env.INTL_USE_FALLBACK_EN ? supportedMessages['en'] : {},
      supportedMessages[locale])
    return mergedMessages
  } else {
    return supportedMessages
  }
}

export const getLocale = () => {
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
