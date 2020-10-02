import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import serve from './mock';
import App from './app';

import './index.css';

if (process.env.NODE_ENV === 'development') {
  serve();
}

ReactDom.render(
  <Router>
    <App />
  </Router>,
  document.querySelector('#root')
);
