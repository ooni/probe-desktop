module.exports = {
    testPathIgnorePatterns: ["/.next/", "/node_modules/"],
    setupFilesAfterEnv: ["./setupTests.js"],
    verbose: true,
    roots: ["<rootDir>/test"],
    testMatch: ["**/test/**/*.e2e.js", "**/test/**/*.test.js"],
    setupFiles: ["<rootDir>/test/lib/setup.js"],
    testSequencer: "<rootDir>/test/lib/sequencer.js",
};
