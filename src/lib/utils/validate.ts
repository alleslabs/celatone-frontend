import { fromHex } from "@cosmjs/encoding";

export const isCodeId = (input: string): boolean =>
  input.length <= 7 && !!Number(input);

export const isTxHash = (input: string): boolean => {
  try {
    fromHex(input);
  } catch {
    return false;
  }
  return input.length === 64;
};
