export const isPositiveInt = (str: string): boolean =>
  /^\+?([1-9]\d*)$/.test(str);

export const isNumeric = (str: string): boolean =>
  /^-?\d+(?:\.\d+)?$/.test(str);

export const numberToHex = (num: number): string => `0x${num.toString(16)}`;
