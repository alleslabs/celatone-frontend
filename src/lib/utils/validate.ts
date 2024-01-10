import { fromHex } from "@cosmjs/encoding";

import { HEX_20_ADDRESS_LENGTH, HEX_32_ADDRESS_LENGTH } from "lib/data";
import type { HexAddr } from "lib/types";

import { padHexAddress } from "./address";

export const isPosDecimal = (input: string): boolean => {
  if (input.startsWith("0x")) return false;
  const numberValue = Number(input);
  return Number.isInteger(numberValue) && numberValue > 0;
};

export const isId = (input: string): boolean =>
  input.length <= 7 && isPosDecimal(input);

export const isTxHash = (input: string): boolean => {
  try {
    fromHex(input);
  } catch {
    return false;
  }
  return input.length === 64;
};

const isHexAddress = (address: string, length: number): boolean => {
  const regex = new RegExp(`^0x[a-fA-F0-9]{1,${length}}$`);
  if (!regex.test(address)) {
    return false;
  }

  const strip = padHexAddress(address as HexAddr, length).slice(2);
  try {
    fromHex(strip);
  } catch {
    return false;
  }
  return true;
};

export const isHexWalletAddress = (address: string) =>
  isHexAddress(address, HEX_20_ADDRESS_LENGTH);

export const isHexModuleAddress = (address: string) =>
  isHexAddress(address, HEX_32_ADDRESS_LENGTH);
