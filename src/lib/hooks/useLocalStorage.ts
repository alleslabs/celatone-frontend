import { getItem, setItem } from "lib/utils";
import { useEffect, useState } from "react";

type PersistedState<T> = [T, (value: T) => void];

type LocalStorageEvent<T> = {
  key: string;
  newValue: T;
  oldValue: T;
};

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): PersistedState<T> => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getItem(key, defaultValue)
  );

  const setValue = (value: T) => {
    setStoredValue(value);
    setItem(key, value);

    window.dispatchEvent(
      new CustomEvent("local-storage", {
        detail: { key, newValue: value, oldValue: storedValue },
      })
    );
  };

  return [storedValue, setValue];
};

export const useLocalStorageListener = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => getItem(key, defaultValue));

  useEffect(() => {
    const handleStorageEvent = (evt: Event) => {
      if ("detail" in evt && evt.detail) {
        const { key: eventKey, newValue } = evt.detail as LocalStorageEvent<T>;
        if (key === eventKey) {
          setValue(newValue);
        }
      }
    };

    window.addEventListener("local-storage", handleStorageEvent);

    return () => {
      window.removeEventListener("local-storage", handleStorageEvent);
    };
  }, [key]);

  return value;
};
