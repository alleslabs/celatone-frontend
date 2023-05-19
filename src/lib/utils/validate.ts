import { fromHex } from "@cosmjs/encoding";

export const isCodeId = (input: string): boolean =>
  input.length <= 7 && Number(input) > 0;

export const isTxHash = (input: string): boolean => {
  try {
    fromHex(input);
  } catch {
    return false;
  }
  return input.length === 64;
};

export const isBlock = (input: string): boolean => Number(input) > 0;
