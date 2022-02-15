import osLocale from 'os-locale'

const defaultLocale = 'en'

export const getMessages = (locale = null) => {

  if (typeof window !== 'undefined' && window.OONITranslations) {
    const supportedMessages = window.OONITranslations
    const defaultMessages = supportedMessages.en ?? {}

    if (locale in supportedMessages) {
      const mergedMessages = Object.assign({}, defaultMessages, supportedMessages[locale])
      return mergedMessages
    }
    return defaultMessages
  }
  // Failed to find the collection of all messages in window.OONITranslations
  // Load 'en' locales from file
  const defaultMessages = require('../../lang/en.json')

  return defaultMessages
}

export const getSupportedLanguages = () => {
  if (typeof window !== 'undefined' && window.OONITranslations) {
    const supportedLanguages = Object.keys(window.OONITranslations)
    return supportedLanguages
  } else {
    return [defaultLocale]
  }
}

export const getLocale = () => {
  // fallback to en
  let navigatorLang = defaultLocale

  // If available, use locale information provided by window.navigator (chrome)
  if (typeof window !== 'undefined') {
    navigatorLang = window.navigator.userLanguage || window.navigator.language
  }

  // If found, use os-locale to detect user's system locale
  navigatorLang = osLocale.sync() || navigatorLang

  return navigatorLang.split('-')[0].split('_')[0]
}
