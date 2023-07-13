export const isPositiveInt = (str: string): boolean =>
  /^\+?([1-9]\d*)$/.test(str);
