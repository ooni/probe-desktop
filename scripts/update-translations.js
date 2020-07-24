/* eslint-disable no-console */
/* global require */
const glob = require('glob')
const { basename } = require('path')
const csvParse = require('csv-parse/lib/sync')
const { readFileSync, writeFileSync } = require('fs')

const supportedLanguages = glob.sync('./lang/*.json').map((f) => basename(f, '.json'))

const lang = csvParse(readFileSync('./data/lang-en.csv'), {from: 2})
  .reduce((messages, row) => {
    const id = row[0]
    const text = row[1].replace(/\{\{(\w+)\}\}/g, '{$1}')

    if (messages.hasOwnProperty(id)) {
      throw new Error(`Duplicate message id: ${id}`)
    }
    messages[id] = text
    return messages
  }, {})

writeFileSync('./lang/en.json', JSON.stringify(lang, null, 2))
console.log('> Wrote messages to: ./lang/en.json')

const translationsMap = supportedLanguages
  .reduce((t, lang) => {
    const trimmedLocaleCode = lang.split('-')[0].split('_')[0]
    t[trimmedLocaleCode] = JSON.parse(readFileSync(`./lang/${lang}.json`))
    return t
  }, {})

const translationsContent = `window.OONITranslations = ${JSON.stringify(translationsMap)}`
writeFileSync('./renderer/static/translations.js', translationsContent)
console.log('> Wrote translations to: ./renderer/static/translations.js')
