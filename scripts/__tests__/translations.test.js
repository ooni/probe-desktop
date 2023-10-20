import glob from 'glob'
import { basename } from 'path'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

describe('Tests for translations', () => {

  const langIdArray = parse(readFileSync('./data/lang-en.csv'), {from: 2}).map(row => row[0])

  const supportedLanguages = glob.sync('./lang/*.json').map((f) => basename(f, '.json'))

  test('Any supported languages are not missing', async () => {
    const expectedLanguagesArray = [
      'ar', 'ca', 'de', 'nl', 'sw',
      'el', 'en', 'es',
      'fa', 'fr', 'hi',
      'id', 'is', 'it',
      'pt-rBR', 'ro', 'ru',
      'sk', 'sq', 'th',
      'tr', 'zh-rCN', 'zh-rTW',
    ]

    expect(supportedLanguages.sort()).toEqual(expectedLanguagesArray.sort())
  })

  supportedLanguages.forEach(langName => {
    test(`${langName}.json contains all the ids and their corresponding messages`, async () => {
      const lang = JSON.parse(readFileSync(`./lang/${langName}.json`))
      
      // If an id, for example 'Onboarding.PopQuiz.Title' is missing from {langName}.json file
      // or if its message is missing, then the id is pushed into missingMessageArray, thus
      // making its length non-zero and failing the test
      const missingMessageArray = langIdArray.filter(id => lang[id] ? false : true)
      expect(missingMessageArray).toHaveLength(0)
    })
  })

})
