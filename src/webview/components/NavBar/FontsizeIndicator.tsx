import React from 'react';

import { ReactComponent as AddIcon } from '@assets/add-line.svg';
import { ReactComponent as MinusIcon } from '@assets/subtract-line.svg';
import { IFontSizeButtonProps } from '../../types';

import './FontsizeIndicator.scss';

export default function FontsizeIndicator({
  value,
  on_add,
  fill,
  on_minus
}: {
  value: number;
  fill: string;
  on_add?: () => void;
  on_minus?: () => void;
}) {
  const Btn = ({ children, onClick }: IFontSizeButtonProps) => (
    <button className="p-1 rounded-full focus:outline-none" styleName="btn" onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="grid grid-flow-col gap-2 items-center" styleName="fontsize-indicator">
      <Btn onClick={on_add}>
        <AddIcon fill={fill} />
      </Btn>
      <p
        className="text-center select-none"
        style={{
          color: fill,
          width: '2rem'
        }}
      >
        {value}
      </p>
      <Btn onClick={on_minus}>
        <MinusIcon fill={fill} />
      </Btn>
    </div>
  );
}
