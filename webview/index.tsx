import React from 'react';
import ReactDom from 'react-dom';

import serve from './mock';
import App from './app';

import './index.css'

if (process.env.NODE_ENV === 'development') {
  serve();
}

ReactDom.render(<App />, document.querySelector('#root'));
