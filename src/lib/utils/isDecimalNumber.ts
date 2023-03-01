export const isDecimalNumber = (number: number): boolean =>
  number - Math.floor(number) !== 0;
