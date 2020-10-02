import React from 'react';
import { render } from '@testing-library/react';

import serve from './mock';
import App from './app';

beforeEach(() => {
  serve();
});

it('App crashing', () => {
  render(<App />);
});
