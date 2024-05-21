export const toggleItem = <T>(array: T[], item: T): T[] => {
  if (array.includes(item)) {
    return array.filter((i) => i !== item);
  }

  return [...array, item];
};
