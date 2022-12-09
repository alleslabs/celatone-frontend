export function isPositiveInt(str: string): boolean {
  return /^\+?([1-9]\d*)$/.test(str);
}
