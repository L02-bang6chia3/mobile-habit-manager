module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'app/(tabs)/index.tsx', 
    
    // '!app/_layout.tsx',
    // '!app/modal.tsx',
    // '!app/(tabs)/_layout.tsx',
    // '!app/(tabs)/explore.tsx',
    // '!components/**', // Nếu bạn không test components thì loại bỏ cả folder này
    '!**/node_modules/**',
  ],
  coverageReporters: ['lcov', 'text', 'html'],
  coverageDirectory: 'coverage',
  // ... các cấu hình khác
};