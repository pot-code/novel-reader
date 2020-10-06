import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Popout from './Popout';

it('should render without error', () => {
  render(
    <Popout gap={4} content={<span>dummy</span>}>
      {() => <div />}
    </Popout>
  );
});

describe('functionality', () => {
  it('should show content', () => {
    const { getByRole } = render(
      <Popout gap={4} content={<span data-testid="content">dummy</span>}>
        {(toggle) => (
          <button role="button" onClick={toggle}>
            click
          </button>
        )}
      </Popout>
    );

    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    fireEvent.click(getByRole('button'));
    expect(screen.queryByTestId('content')).toBeInTheDocument();
  });

  it('should toggle visibility', () => {
    const { getByRole } = render(
      <Popout gap={4} content={<span data-testid="content">dummy</span>}>
        {(toggle) => (
          <button role="button" onClick={toggle}>
            click
          </button>
        )}
      </Popout>
    );

    fireEvent.click(getByRole('button'));
    expect(screen.queryByTestId('content')).toBeInTheDocument();
    fireEvent.click(getByRole('button'));
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should keep content when click the inside of component', () => {
    const { getByRole, getByTestId } = render(
      <div>
        <Popout gap={4} content={<span data-testid="content">dummy</span>}>
          {(toggle) => (
            <button role="button" onClick={toggle}>
              click
            </button>
          )}
        </Popout>
        <div data-testid="outside">outside</div>
      </div>
    );

    fireEvent.click(getByRole('button'));
    expect(screen.queryByTestId('content')).toBeInTheDocument();
    fireEvent.click(getByTestId('content'));
    expect(screen.queryByTestId('content')).toBeInTheDocument();
  });
});
