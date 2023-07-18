/* eslint-disable no-console */
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): PersistedState<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key “${key}”:`, e);
      return defaultValue as T;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (e) {
      console.warn(`Error setting localStorage key “${key}”:`, e);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
