import React from 'react';

import { ReactComponent as AstronautSVG } from '@assets/astronaut.svg';

export function NotFound() {
  return (
    <div className="text-center mt-12">
      <div className="inline-block mb-8 p-2 shadow-md rounded-lg">
        <AstronautSVG height="248" style={{ display: 'inline-block', verticalAlign: 'bottom' }} />
      </div>
      <p
        className="text-gray-500 text-lg"
        style={{
          fontFamily: 'comic sans ms'
        }}
      >
        It's an empty space
      </p>
    </div>
  );
}
