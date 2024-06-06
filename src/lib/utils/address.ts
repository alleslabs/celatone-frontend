import { Ripemd160, sha256 } from "@cosmjs/crypto";
import {
  fromBase64,
  fromBech32,
  fromHex,
  toBech32,
  toHex,
} from "@cosmjs/encoding";

import type { AddressReturnType } from "lib/app-provider";
import type { BechAddr, HexAddr, Option } from "lib/types";

import { sha256Hex } from "./sha256";

export const hashAddress = (address: Option<string>): Option<string> => {
  if (!address) return undefined;
  return sha256Hex(fromBech32(address).data);
};

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

export const bech32AddressToHex = (addr: BechAddr): HexAddr =>
  "0x".concat(toHex(fromBech32(addr).data)) as HexAddr;

export const padHexAddress = (hexAddr: HexAddr, length: number): HexAddr =>
  `0x${hexAddr.slice(2).padStart(length, "0")}` as HexAddr;

export const unpadHexAddress = (hexAddr: HexAddr) =>
  `0x${hexAddr.slice(2).replace(/^0+/, "")}` as HexAddr;

export const hexToBech32Address = (
  prefix: string,
  hexAddr: HexAddr,
  length: number
): BechAddr => {
  const strip = padHexAddress(hexAddr, length).slice(2);
  return toBech32(prefix, fromHex(strip)) as BechAddr;
};

export function consensusPubkeyToHexAddress(consensusPubkey?: {
  "@type": string;
  key: string;
}) {
  if (!consensusPubkey) return "";
  const raw = "";
  if (consensusPubkey["@type"] === "/cosmos.crypto.ed25519.PubKey") {
    const pubkey = fromBase64(consensusPubkey.key);
    if (pubkey) return toHex(sha256(pubkey)).slice(0, 40).toUpperCase();
  }

  if (consensusPubkey["@type"] === "/cosmos.crypto.secp256k1.PubKey") {
    const pubkey = fromBase64(consensusPubkey.key);
    if (pubkey) return toHex(new Ripemd160().update(sha256(pubkey)).digest());
  }
  return raw;
}
