import type { HexAddr } from "lib/types";

import { fromHex } from "@cosmjs/encoding";
import { HEX_MODULE_ADDRESS_LENGTH, HEX_WALLET_ADDRESS_LENGTH } from "lib/data";
import { z } from "zod";

import { padHexAddress } from "./address";

export const isPosDecimal = (input: string): boolean => {
  if (input.startsWith("0x")) return false;
  const numberValue = Number(input);
  return Number.isInteger(numberValue) && numberValue > 0;
};

export const isId = (input: string): boolean =>
  input.length <= 7 && isPosDecimal(input);

export const isUrl = (string: string): boolean =>
  z.string().url().safeParse(string).success;

export const isHex = (input: string): boolean => {
  if (input.trim() === "") return false;
  try {
    fromHex(input);
  } catch {
    return false;
  }
  return true;
};

export const isTxHash = (input: string): boolean =>
  isHex(input) && input.length === 64;

const isHexAddress = (address: string, length: number): boolean => {
  const regex = new RegExp(`^0x[a-fA-F0-9]{1,${length}}$`);
  if (!regex.test(address)) {
    return false;
  }

  const strip = padHexAddress(address as HexAddr, length).slice(2);
  return isHex(strip);
};

export const isHexFixedBytes = (address: string, length: number): boolean => {
  const regex = new RegExp(`^0x[a-fA-F0-9]{${length}}$`);
  if (!regex.test(address)) {
    return false;
  }

  const strip = padHexAddress(address as HexAddr, length).slice(2);
  return isHex(strip);
};

export const isMovePrefixHexModuleAddress = (address: string) => {
  const regex = new RegExp(`^move/[a-fA-F0-9]{${HEX_MODULE_ADDRESS_LENGTH}}$`);
  return regex.test(address);
};

export const isHexWalletAddress = (address: string) =>
  isHexAddress(address, HEX_WALLET_ADDRESS_LENGTH);

export const isHexModuleAddress = (address: string) =>
  isHexAddress(address, HEX_MODULE_ADDRESS_LENGTH);

export const isHex20Bytes = (address: string) =>
  isHexFixedBytes(address, HEX_WALLET_ADDRESS_LENGTH);

export const is0x = (address: string): boolean => address === "0x";
