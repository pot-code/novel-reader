import { createContext } from 'react';
import { Accents, Themes } from './enums';
import { IThemeCombo } from './types';

export const UIThemeContext = createContext({
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
