module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@reduxjs|react-redux|react-router|react-router-dom)/)',
  ],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: 'http://localhost:9999/api'
      }
    }
  }
}; 