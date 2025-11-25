import { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/helpers';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => loadFromStorage<T>(key, initialValue));

  useEffect(() => {
    saveToStorage<T>(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
