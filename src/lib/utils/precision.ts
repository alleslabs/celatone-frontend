export const convertAmountWithprecision = (
  amount: string,
  precision: number
) => {
  const divider = 10 ** precision;
  const amountToInt = parseInt(amount, 10);
  return amountToInt / divider;
};
