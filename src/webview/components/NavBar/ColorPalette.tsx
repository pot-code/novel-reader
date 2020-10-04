import React from 'react';

import { IThemeCombo } from '../../types';

type PaletteItemProps = {
  foreground: string;
  background: string;
  theme: IThemeCombo;
};

type ColorPaletteProps = {
  size?: number;
  palettes: PaletteItemProps[];
  on_select?: (palette: IThemeCombo) => void;
};

export default function ColorPalette({ size = 24, palettes, on_select }: ColorPaletteProps) {
  const origin = size >> 1;
  const radius = size >> 1;

  const PaletteItem = ({ foreground, background, theme }: PaletteItemProps) => {
    function on_palette_click() {
      if (on_select) {
        on_select(theme);
      }
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="cursor-pointer"
        onClick={on_palette_click || undefined}
      >
        <g transform={`rotate(-45 ${radius} ${radius})`}>
          <circle cx={origin} cy={origin} r={radius} fill={background} />
          <path d={`M 0,${radius} A ${radius} ${radius} 90 0 1 ${size},${radius} L 0,${radius}`} fill={foreground} />
        </g>
      </svg>
    );
  };

  return (
    <div className="grid grid-flow-col gap-2">
      {palettes.map((palette, index) => (
        <PaletteItem
          key={index}
          foreground={palette.foreground}
          background={palette.background}
          theme={palette.theme}
        />
      ))}
    </div>
  );
}
