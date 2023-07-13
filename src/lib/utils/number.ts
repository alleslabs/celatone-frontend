export const isPositiveInt = (str: string): boolean =>
  /^\+?([0-9]\d*)$/.test(str);
