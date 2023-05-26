export const getMaxLengthError = (
  field: string,
  currentLength: number,
  maxLength: number
) =>
  currentLength > maxLength
    ? `${field} is too long. (${currentLength}/${maxLength})`
    : undefined;
