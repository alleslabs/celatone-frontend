export const textLine = (
  isDisplaySingle: string | undefined,
  toggle: boolean
) => {
  if (isDisplaySingle) return 10;
  if (toggle) return 0;
  return 4;
};
