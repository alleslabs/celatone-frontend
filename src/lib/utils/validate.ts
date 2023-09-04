import { fromHex } from "@cosmjs/encoding";

export const isCodeId = (input: string): boolean => {
  const numberValue = Number(input);
  return input.length <= 7 && Number.isInteger(numberValue) && numberValue > 0;
};

export const isTxHash = (input: string): boolean => {
  try {
    fromHex(input);
  } catch {
    return false;
  }
  return input.length === 64;
};

export const isBlock = (input: string): boolean => {
  const numberValue = Number(input);
  return Number.isInteger(numberValue) && numberValue > 0;
};

export const isHexAddress = (address: string): boolean => {
  const strip = address.replace("0x", "");
  try {
    fromHex(strip);
  } catch {
    return false;
  }
  return strip.length <= 40;
};
