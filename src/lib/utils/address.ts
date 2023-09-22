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

export const padHexAddress = (hexAddr: HexAddr): HexAddr =>
  `0x${hexAddr.slice(2).padStart(40, "0")}` as HexAddr;

export const unpadHexAddress = (hexAddr: HexAddr) =>
  `0x${hexAddr.slice(2).replace(/^0+/, "")}` as HexAddr;

export const hexToBech32Address = (
  prefix: string,
  hexAddr: HexAddr
): HumanAddr => {
  const strip = padHexAddress(hexAddr).slice(2);
  return toBech32(prefix, fromHex(strip)) as HumanAddr;
};
