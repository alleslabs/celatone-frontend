import { useCallback, useState } from "react";

// Reference: https://usehooks-ts.com/react-hook/use-read-local-storage

type Value<T> = T | null;

export const useReadLocalStorage = <T>(key: string): Value<T> => {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): Value<T> => {
    // Prevent build error "window is undefined" but keep keep working
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      return null;
    }
  }, [key]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<Value<T>>(readValue);

  const handleStorageChange = useCallback(() => {
    setStoredValue(readValue());
  }, [readValue]);

  window.addEventListener("local-storage", handleStorageChange);
  return storedValue;
};
