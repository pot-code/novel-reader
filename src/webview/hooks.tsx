import { useEffect, useRef, useState } from 'react';
import { IVsCodeMessage, VsCodeResponseType } from './shared';
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
  const [combo, set_combo] = useState(initial);

  function on_vscode_color_scheme_change(data: IVsCodeMessage) {
    set_combo({
      accents: combo.accents,
      theme: data.payload
    });
  }

  function on_message(msg: MessageEvent) {
    const data = msg.data as IVsCodeMessage;
    if (data.type === VsCodeResponseType.THEME) {
      on_vscode_color_scheme_change(data);
    }
  }
  useEffect(() => {
    window.addEventListener('message', on_message);
    return () => {
      window.removeEventListener('message', on_message);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = combo.theme;
  }, [combo]);

  return [combo, set_combo];
}
