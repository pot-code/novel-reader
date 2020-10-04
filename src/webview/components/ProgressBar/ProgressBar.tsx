import React from 'react';

import './ProgressBar.scss';

type ProgressBarProps = {
  max: number;
  value: number;
  fill: string;
};

export default function ProgressBar({ max, value, fill }: ProgressBarProps) {
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
