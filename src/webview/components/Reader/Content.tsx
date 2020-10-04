import React from 'react';

import './Content.scss';

type ContentProps = {
  lines: string[];
  fontsize: number;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Content({ lines, fontsize }: ContentProps) {
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
