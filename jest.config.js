process.env.IS_UNIT_TEST = 'true'
process.env.NODE_ENV = 'test'

// Display log messages while running unit tests
// process.env.ENABLE_LOGS_IN_TESTS = true

// Clear any sensitive environment variables to prevent accidential exposure or usage of services while testing
process.env.BITBUCKET_PASSWORD = undefined
process.env.JIRA_API_TOKEN = undefined
process.env.GITHUB_ACCESS_TOKEN = undefined
process.env.JENKINS_PASSWORD = undefined
process.env.SLACK_TOKEN = undefined

module.exports = {
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.ts', '!src/**/*.d.ts', '!**/node_modules/**'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  // eslint-disable-next-line spellcheck/spell-checker
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  // maxWorkers: 1,
  moduleFileExtensions: ['js', 'ts', 'json', 'yml', 'yaml'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  modulePaths: ['node_modules', '<rootDir>/src'],
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testRegex: '.*\\.test\\.(js|ts)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
