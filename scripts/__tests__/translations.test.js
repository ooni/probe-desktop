import glob from 'glob'
import { basename } from 'path'
import csvParse from 'csv-parse/lib/sync'
import { readFileSync } from 'fs'

describe('Tests for translations', () => {

  const langIdArray = csvParse(readFileSync('./data/lang-en.csv'), {from: 2}).map(row => row[0])

  const supportedLanguages = glob.sync('./lang/*.json').map((f) => basename(f, '.json'))

  test('Any supported languages are not missing', async () => {
    const expectedLanguagesArray = [
      'ar', 'ca', 'de',
      'el', 'en', 'es',
      'fa', 'fr', 'hi',
      'id', 'is', 'it',
      'pt-rBR', 'ro', 'ru',
      'sk', 'sq', 'th',
      'tr', 'zh-rCN', 'zh-rTW',
    ]

    expect(supportedLanguages.sort()).toEqual(expectedLanguagesArray.sort())
  })

  test('en.json contains all the ids', async () => {
    const En = JSON.parse(readFileSync('./lang/en.json'))

    const missingMessageArray = langIdArray.filter(id => En[id] ? false : true)
    expect(missingMessageArray).toHaveLength(0)
  })
})
