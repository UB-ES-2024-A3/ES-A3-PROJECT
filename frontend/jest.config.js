module.exports = {
    preset: 'ts-jest', // Use ts-jest for TypeScript
    testEnvironment: 'jest-environment-jsdom', // Use jsdom for testing React components
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js', 'dotenv/config'], // Set up testing-library
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for .ts and .tsx files
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'], // Avoid transforming node_modules
  };
  