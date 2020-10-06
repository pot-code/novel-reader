import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import IconButton from './IconButton';
import { ReactComponent as Icon } from '@assets/add-line.svg';

it('should render without error', () => {
  render(<IconButton Icon={Icon} fill="#000000" />);
});

describe('click button', () => {
  it('should call click handler', () => {
    const handler = jest.fn(() => {});
    const { getByRole } = render(<IconButton Icon={Icon} fill="#000000" onClick={handler} />);

    fireEvent.click(getByRole('button'));
    expect(handler).toHaveBeenCalled();
  });

  it('should not call click handler while disabled is true', () => {
    const handler = jest.fn(() => {});
    const { getByRole } = render(<IconButton Icon={Icon} fill="#000000" onClick={handler} disabled />);

    fireEvent.click(getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('styles', () => {
  it('should have disable class', () => {
    const handler = jest.fn(() => {});
    const { getByRole } = render(<IconButton Icon={Icon} fill="#000000" onClick={handler} disabled />);

    expect(getByRole('button')).toHaveClass('icon-button--disabled');
    expect(getByRole('button')).not.toHaveClass('icon-button--active');
  });

  it('should have active class', () => {
    const handler = jest.fn(() => {});
    const { getByRole } = render(<IconButton Icon={Icon} fill="#000000" onClick={handler} active />);

    expect(getByRole('button')).toHaveClass('icon-button--active');
    expect(getByRole('button')).not.toHaveClass('icon-button--disabled');
  });
});
