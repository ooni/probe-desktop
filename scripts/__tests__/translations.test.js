import glob from 'glob'
import { basename } from 'path'
import csvParse from 'csv-parse/lib/sync'
import { readFileSync } from 'fs'

// Using the file in the translations repo instead of the local one: './data/lang-en.csv'
const SOURCE_CSV_FILE = '../translations/probe-mobile/en/strings.csv'

describe('Tests for translations', () => {

  const langIdArray = csvParse(readFileSync(SOURCE_CSV_FILE), {from: 2}).map(row => row[0])

  const supportedLanguages = glob.sync('./lang/*.json').map((f) => basename(f, '.json'))

  test('Any supported languages are not missing', async () => {
    const expectedLanguagesArray = [
      'ar', 'ca', 'de', 'el', 'en', 'es', 'fa', 'fr', 'hi', 'id', 'is', 'it', 'nl', 'pt-rBR', 'ro', 'ru', 'sk', 'sq', 'sw', 'th', 'tr', 'zh-rCN', 'zh-rTW',
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
