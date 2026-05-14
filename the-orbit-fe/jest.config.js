module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!**/node_modules/**"
],
  coverageReporters: ['lcov', 'text', 'html'],
  coverageDirectory: 'coverage',
  // ... các cấu hình khác
};