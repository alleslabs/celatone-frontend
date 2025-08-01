import type { AddressReturnType } from "lib/app-provider";
import type { BechAddr, HexAddr, Option, Pubkey } from "lib/types";

import { keccak256, Ripemd160, Secp256k1, sha256 } from "@cosmjs/crypto";
import {
  fromBase64,
  fromBech32,
  fromHex,
  toBech32,
  toHex,
} from "@cosmjs/encoding";
import { zBechAddr20, zHexAddr } from "lib/types";

import { utf8ToBytes } from "./base64";
import { uint8ArrayToHexString } from "./hex";
import { sha256Hex } from "./sha256";

export const hashAddress = (address: Option<string>): Option<string> => {
  if (!address) return undefined;
  return sha256Hex(fromBech32(address).data);
};

export const getAddressTypeText = (addressType: AddressReturnType) => {
  switch (addressType) {
    case "contract_address":
      return "(Contract address)";
    case "user_address":
      return "(Wallet address)";
    case "validator_address":
      return "(Validator address)";
    case "invalid_address":
    default:
      return "(Invalid address)";
  }
};

export const bech32AddressToHex = (addr: BechAddr): HexAddr =>
  zHexAddr.parse("0x".concat(toHex(fromBech32(addr).data)));

export const padHexAddress = (hexAddr: HexAddr, length: number): HexAddr =>
  zHexAddr.parse(`0x${hexAddr.slice(2).padStart(length, "0")}`);

export const unpadHexAddress = (hexAddr: HexAddr) =>
  zHexAddr.parse(`0x${hexAddr.slice(2).replace(/^0+/, "")}`);

export const hexToBech32Address = (
  prefix: string,
  hexAddr: HexAddr,
  length: number
): BechAddr => {
  const strip = padHexAddress(hexAddr, length).slice(2);
  return toBech32(prefix, fromHex(strip)) as BechAddr;
};

export const convertAccountPubkeyToAccountAddress = (
  accountPubkey: Pubkey,
  prefix: string
) => {
  const firstAccountPubkey =
    "key" in accountPubkey ? accountPubkey : accountPubkey.publicKeys[0];

  if (firstAccountPubkey["@type"] === "/cosmos.crypto.ed25519.PubKey") {
    const pubkey = fromBase64(firstAccountPubkey.key);
    const data = fromHex(toHex(sha256(pubkey)).slice(0, 40));
    return zBechAddr20.parse(toBech32(prefix, data));
  }

  if (firstAccountPubkey["@type"] === "/cosmos.crypto.secp256k1.PubKey") {
    const pubkey = fromBase64(firstAccountPubkey.key);
    const data = new Ripemd160().update(sha256(pubkey)).digest();
    return zBechAddr20.parse(toBech32(prefix, data));
  }

  if (
    firstAccountPubkey["@type"] === "/initia.crypto.v1beta1.ethsecp256k1.PubKey"
  ) {
    const pubkey = fromBase64(firstAccountPubkey.key);
    const uncompressedPubkey = Secp256k1.uncompressPubkey(pubkey);
    const data = keccak256(uncompressedPubkey.slice(1)).slice(12);
    return zBechAddr20.parse(toBech32(prefix, data));
  }

  return zBechAddr20.parse("");
};

export const toChecksumAddress = <T extends string>(address: T): T => {
  const lowerCaseAddress = address.toLowerCase().replace(/^0x/i, "");

  const hash = `0x${uint8ArrayToHexString(
    keccak256(utf8ToBytes(lowerCaseAddress))
  )}`;

  // EIP-1052, keccak was given empty data
  // if hash is equal to c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
  if (
    hash ===
    "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"
  )
    return "" as T;

  let checksumAddress = "0x";
  const addressHash = hash.replace(/^0x/i, "");

  for (let i = 0; i < lowerCaseAddress.length; i += 1) {
    // If ith character is 8 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += lowerCaseAddress[i].toUpperCase();
    } else {
      checksumAddress += lowerCaseAddress[i];
    }
  }
  return checksumAddress as T;
};

export const isBech32Address = (address: string) => {
  try {
    fromBech32(address);
    return true;
  } catch {
    return false;
  }
};
