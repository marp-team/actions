module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  // coverageThreshold: { global: { lines: 95 } },
  preset: 'ts-jest',
  testEnvironment: 'node',
}
