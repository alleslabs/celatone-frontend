import { fromHex } from "@cosmjs/encoding";

import type { HexAddr } from "lib/types";

import { padHexAddress } from "./address";

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
  if (!/^0x[a-fA-F0-9]{1,40}$/.test(address)) {
    return false;
  }

  const strip = padHexAddress(address as HexAddr, 40).slice(2);
  try {
    fromHex(strip);
  } catch {
    return false;
  }
  return true;
};

export const isHexModuleAddress = (address: string): boolean => {
  if (!/^0x[a-fA-F0-9]{1,64}$/.test(address)) {
    return false;
  }

  const strip = padHexAddress(address as HexAddr, 64).slice(2);
  try {
    fromHex(strip);
  } catch {
    return false;
  }
  return true;
};
