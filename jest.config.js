module.exports = {
  // transform: { '^.+\\.tsx?$': 'ts-jest' },
  testRegex: '/src/webview/.*\\.(test|spec)?\\.(js|ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // mocks
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    '\\.s?css$': '<rootDir>/__mocks__/styleMock.js',
    '^framer-motion$': '<rootDir>/__mocks__/framerMotionMock.js',
    // sync with webpack alias
    '^@hooks(.*)$': '<rootDir>/src/webview/hooks$1',
    '^@assets(.*)$': '<rootDir>/src/webview/assets$1'
  },
  setupFiles: ['<rootDir>/__setup__/window.setup.js']
};
