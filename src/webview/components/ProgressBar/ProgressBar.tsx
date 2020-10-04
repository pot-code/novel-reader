import React from 'react';

import { IProgressBarProps } from '../../types';

import './ProgressBar.scss';

export default function ProgressBar({ max, value, fill }: IProgressBarProps) {
  return (
    <div styleName="progress-bar" className="overflow-hidden">
      <div
        styleName="bar"
        style={{
          backgroundColor: fill,
          width: `${(value / max) * 100}%`
        }}
      />
    </div>
  );
}
