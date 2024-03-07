import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { getItem, setItem } from "lib/utils";

type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): PersistedState<T> => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getItem(key, defaultValue)
  );

  useEffect(() => setItem(key, storedValue), [key, storedValue]);

  return [storedValue, setStoredValue];
};
