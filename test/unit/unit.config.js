module.exports = {
  rootDir: '../../',
  testPathIgnorePatterns: ['/.next/', '/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/test/lib/setupTests.js'],
  verbose: true,
  roots: ['<rootDir>/test', '<rootDir>/renderer', '<rootDir>/main', '<rootDir>/scripts'],
  testSequencer: '<rootDir>/test/lib/sequencer.js',
  moduleNameMapper: {
    'electron': '<rootDir>/test/mocks/electronMock.js',
    '^csv-parse/sync': '<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs'
  },
  testEnvironment: 'jsdom',
}
