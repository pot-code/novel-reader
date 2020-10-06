import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

import serve from '../../mock';
import App from './app';

beforeEach(() => {
  serve();
});

afterEach(cleanup);

it('should render without error', () => {
  render(
    <Router>
      <App />
    </Router>
  );
});

it('should render 404 page', () => {
  const { getByText } = render(
    <Router initialEntries={['/404']}>
      <App />
    </Router>
  );

  expect(getByText("It's an empty space")).toBeInTheDocument();
});
