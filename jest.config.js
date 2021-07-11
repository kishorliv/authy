module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  setupFiles: ['tests/setup-tests.js'],
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
};
