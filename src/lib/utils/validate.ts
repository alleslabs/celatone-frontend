import { fromHex } from "@cosmjs/encoding";

import { HEX_MODULE_ADDRESS_LENGTH, HEX_WALLET_ADDRESS_LENGTH } from "lib/data";
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
  isHexAddress(address, HEX_WALLET_ADDRESS_LENGTH);

export const isHexModuleAddress = (address: string) =>
  isHexAddress(address, HEX_MODULE_ADDRESS_LENGTH);
