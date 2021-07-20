const { basename } = require('path')

const TestSequencer = require('@jest/test-sequencer').default

class CustomSequencer extends TestSequencer {
  sort(tests) {

    // The listed test files will be processed in this order
    // Other `*.e2e.js` files will be picked after these in no specific order
    const orderPath = [
      'onboarding',
      'sidebar',
      'dashboard',
      'settings'
    ]

    // based on: https://github.com/facebook/jest/issues/6194#issuecomment-521521514
    return tests.sort((testA, testB) => {
      const indexA = orderPath.indexOf(basename(testA.path, '.e2e.js'))
      const indexB = orderPath.indexOf(basename(testB.path, '.e2e.js'))
      if (indexA === indexB) return 0 // do not swap when tests both not specify in order.
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA < indexB ? -1 : 1
    })
  }
}

module.exports = CustomSequencer
