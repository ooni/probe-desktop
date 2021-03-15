## Adding a new test

### Define UI and metadata for test
* Add the test-specific component in `renderer/components/nettests/<group>/<testname.js>`
  1. export metadata about the test as `default`
  ```javascript
  export default {
    name: <FormattedMessage id='Test.<Test>.Fullname' />,
    icon: <>,
    methodology: 'https://...'
  }
  ```
  2. export the UI for the test as a named export
  ```javascript
  const Telegram = () => </>
  export { Telegram }
  ```
  3. Add icon in `ooni-components` and import here

### Add to test collections

* In `renderer/components/nettests/index.js`
  * Export the new test as part of the `tests` collection
  * Map probe-cli log message key `Nettests.<TestName>` to test group name in `cliTestKeysToGroups`

### Load UI in Measurement Container

* In `renderer/components/measurement/MeasurementContainer.js`, map the test UI component to the test name in `detailsMap` collection.

### Update copy
* Update csv file in `data/lang-en.csv`
* Run `node update-translations.js`