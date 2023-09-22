export const getStorageKey = (key: string): string => `celatone-${key}`;

export const setItem = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(getStorageKey(key), JSON.stringify(value));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error setting localStorage item:", error);
  }
};

export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const value = window.localStorage.getItem(getStorageKey(key));
    if (value) {
      return JSON.parse(value) as T;
    }
    return defaultValue;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting localStorage item:", error);
    return defaultValue;
  }
};
