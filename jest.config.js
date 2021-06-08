module.exports = {
    testPathIgnorePatterns: ["/.next/", "/node_modules/"],
    setupFilesAfterEnv: ["./setupTests.js"],
    verbose: true,
    roots: ["<rootDir>/test", "<rootDir>/renderer"],
    setupFiles: ["<rootDir>/test/lib/setup.js"],
    testSequencer: "<rootDir>/test/lib/sequencer.js",
};
