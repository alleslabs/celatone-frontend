import { fromBech32, fromHex, toBech32, toHex } from "@cosmjs/encoding";

import type { AddressReturnType } from "lib/app-provider";
import type { HexAddr, HumanAddr } from "lib/types";

export const getAddressTypeText = (addressType: AddressReturnType) => {
  switch (addressType) {
    case "contract_address":
      return "(Contract Address)";
    case "user_address":
      return "(Wallet Address)";
    case "validator_address":
      return "(Validator Address)";
    case "invalid_address":
    default:
      return "(Invalid Address)";
  }
};

export const bech32AddressToHex = (addr: HumanAddr): HexAddr =>
  "0x".concat(toHex(fromBech32(addr).data)) as HexAddr;

export const hexToBech32Address = (
  prefix: string,
  hexAddr: HexAddr
): HumanAddr => {
  let strip = hexAddr.replace("0x", "");
  if (strip.length < 40) strip = strip.padStart(40, "0");
  return toBech32(prefix, fromHex(strip)) as HumanAddr;
};

export const unpadHexAddress = (hexAddr: HexAddr) => {
  const hex = hexAddr.startsWith("0x") ? hexAddr.slice(2) : hexAddr;
  return "0x".concat(hex.replace(/^0+/, ""));
};
