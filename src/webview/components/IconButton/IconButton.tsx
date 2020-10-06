import React from 'react';
import cx from 'classnames';

import './IconButton.scss';

type IconButtonProps = {
  Icon: ReactSVG;
  fill: string;
  active?: boolean;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  Icon,
  fill,
  active = false,
  disabled = false,
  onClick,
  ...rest
}: IconButtonProps) {
  return (
    <button
      role="button"
      className="rounded-full p-2"
      styleName={cx('icon-button', {
        'icon-button--disabled': disabled,
        'icon-button--active': active
      })}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      <Icon height="24" width="24" fill={fill} />
    </button>
  );
}
