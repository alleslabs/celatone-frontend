export const findIndexOpt = <T = unknown[]>(
  array: T[],
  predicate: (value: T) => boolean
) => {
  const index = array.findIndex(predicate);
  return index === -1 ? undefined : index;
};
