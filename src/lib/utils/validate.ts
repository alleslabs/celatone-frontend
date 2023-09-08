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
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return false;
  }

  const strip = address.slice(2);

  try {
    fromHex(strip);
  } catch {
    return false;
  }
  return true;
};
