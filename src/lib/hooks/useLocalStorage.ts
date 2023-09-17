/* eslint-disable no-console */
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): PersistedState<T> => {
  const storageKey = `celatone-${key}`;
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch (e) {
      return defaultValue as T;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(storedValue));
    } catch (e) {
      // I want application to not crush, but don't care about the message
    }
  }, [storageKey, storedValue]);

  return [storedValue, setStoredValue];
};
