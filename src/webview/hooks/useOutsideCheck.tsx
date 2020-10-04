import { useEffect, useRef } from 'react';

export default function useOutsideCheck<T extends HTMLElement>(callback: (outside: boolean) => void) {
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
