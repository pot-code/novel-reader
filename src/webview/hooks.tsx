import { useEffect, useRef, useState } from 'react';
import { THEME_LOCAL_ID } from './constants';
import { IThemeCombo } from './types';

export function useOutsideCheck<T extends HTMLElement>(callback: (outside: boolean) => void) {
  const ref = useRef<T>(null);
  const listener = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback(true);
    } else {
      callback(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, []);
  return ref;
}

export function useRootTheme(initial: IThemeCombo): [IThemeCombo, React.Dispatch<React.SetStateAction<IThemeCombo>>] {
  const [theme, set_theme] = useState(initial);

  useEffect(() => {
    const saved_theme = window.localStorage.getItem(THEME_LOCAL_ID);
    if (saved_theme !== null) {
      const parsed_theme = JSON.parse(saved_theme);
      set_theme(parsed_theme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_LOCAL_ID, JSON.stringify(theme));
    document.documentElement.dataset.theme = theme.theme;
  }, [theme]);

  return [theme, set_theme];
}
