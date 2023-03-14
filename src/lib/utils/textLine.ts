/**
 * Returns number of lines of text. If all text need to be shown, return 0.
 *
 * @param isDisplaySingle - Tell whether the component has peer component or not
 * @returns Returns number of line of text.
 *
 */

export const textLine = (isDisplaySingle: boolean) => {
  if (isDisplaySingle) return 2;
  return 4;
};
