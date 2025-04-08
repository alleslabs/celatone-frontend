import type { Dispatch, SetStateAction } from "react";

import { getItem, setItem } from "lib/utils";
import { useEffect, useState } from "react";

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
