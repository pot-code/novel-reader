module.exports = {
  // transform: { '^.+\\.tsx?$': 'ts-jest' },
  testRegex: '/src/webview/.*\\.(test|spec)?\\.(js|ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
    '\\.s?css$': '<rootDir>/__mocks__/styleMock.js'
  },
  setupFiles: ['<rootDir>/__setup__/window.setup.js']
};
