const path = require('path');

module.exports.paths = {
  build: path.resolve(__dirname, '../assets/webview'),
  public: 'assets/webview/',
  src: path.resolve(__dirname, '../src/webview'),
  project_root: path.resolve(__dirname, '../'),
  template: path.resolve(__dirname, '../template.ejs'),
  tsconfig: path.resolve(__dirname, '../src/webview/tsconfig.json')
};
