import { useState, useEffect } from 'react';

/**
 * Simple hook to persist state to localStorage.
 * key: storage key
 * initialValue: value or function returning value
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
      return typeof initialValue === 'function' ? (initialValue as any)() : initialValue;
    } catch (e) {
      console.error('useLocalStorage: read error', e);
      return typeof initialValue === 'function' ? (initialValue as any)() : initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('useLocalStorage: write error', e);
    }
  }, [key, state]);

  const remove = () => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('useLocalStorage: remove error', e);
    }
  };

  return [state, setState, remove] as const;
}
