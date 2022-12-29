export const textLine = (isDisplaySingle: boolean, toggle: boolean) => {
  if (isDisplaySingle) return 2;
  if (toggle) return 0;
  return 4;
};
