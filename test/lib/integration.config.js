module.exports = {
  rootDir: '../../',
  testPathIgnorePatterns: ['/.next/', '/node_modules/'],
  setupFilesAfterEnv: ['jest-os-detection', '<rootDir>/test/lib/setupTests.js'],
  verbose: true,
  roots: ['<rootDir>/test', '<rootDir>/renderer'],
  testSequencer: '<rootDir>/test/lib/sequencer.js',
}
