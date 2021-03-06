import { createContext } from 'react';
import { Accents, Themes } from './constants';
import { IThemeCombo } from './types';

export const UIThemeContext = createContext<{ accents: string; theme: string }>({
  accents: Accents.PURPLE,
  theme: Themes.LIGHT
});

export const builtins: IThemeCombo[] = [
  {
    accents: Accents.PURPLE,
    theme: Themes.LIGHT
  },
  {
    accents: Accents.BLUE,
    theme: Themes.LIGHT
  },
  {
    accents: Accents.CYAN,
    theme: Themes.DARK
  }
];
