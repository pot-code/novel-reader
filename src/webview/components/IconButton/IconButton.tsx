import React from 'react';
import cx from 'classnames';

import { IIconButtonProps } from '../../types';

import './IconButton.scss';

export default function IconButton({
  Icon,
  fill,
  active = false,
  disabled = false,
  onClick,
  ...rest
}: IIconButtonProps) {
  return (
    <button
      className="rounded-full p-2"
      styleName={cx('icon-button', {
        'icon-button--disabled': disabled,
        'icon-button--active': active
      })}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      <Icon height="24" width="24" fill={fill} />
    </button>
  );
}