export const isDecimalNumber = (number: number): boolean => {
  return number - Math.floor(number) !== 0;
};
