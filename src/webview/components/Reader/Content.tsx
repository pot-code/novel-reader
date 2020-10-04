import React from 'react';

import { IContentProps } from '../../types';

import './Content.scss';

export default function Content({ lines, fontsize }: IContentProps) {
  return (
    <div styleName="content-container">
      <div
        styleName="content"
        style={{
          fontSize: `${fontsize}px`
        }}
      >
        {lines.map((line, idx) => (
          <p key={idx} className="whitespace-pre-wrap break-all my-3">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
