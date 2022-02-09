import osLocale from 'os-locale'

const defaultLocale = 'en'

export const getMessages = (locale = null) => {
  let supportedMessages = {
    en: require('../../lang/en.json')
  }

  if (typeof window !== 'undefined' && window.OONITranslations) {
    supportedMessages = window.OONITranslations
  }

  if (locale in supportedMessages) {
    const mergedMessages = Object.assign(
      {},
      supportedMessages[defaultLocale],
      supportedMessages[locale]
    )
    return mergedMessages
  } else {
    return supportedMessages[defaultLocale]
  }
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
