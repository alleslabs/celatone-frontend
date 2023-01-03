/**
 * Returns number of lines of text. If all text need to be shown, return 0.
 *
 * @param isDisplaySingle - Tell whether the component has peer component or not
 * @param isShowMore - Tell whether the component has to show all text or not
 * @returns Returns number of line of text.
 *
 */

export const textLine = (isDisplaySingle: boolean, isShowMore: boolean) => {
  if (isDisplaySingle) return 2;
  if (isShowMore) return 0;
  return 4;
};
