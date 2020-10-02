import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';

import serve from './mock';
import App from './app';

beforeEach(() => {
  serve();
});

it('App crashing', () => {
  render(
    <Router>
      <App />
    </Router>
  );
});
