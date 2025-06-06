import type { Hex } from "lib/types";

import { zHex, zHexAddr20 } from "lib/types";
import { toChecksumAddress } from "lib/utils";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const readAddress = (value: unknown) => {
  if (typeof value !== "string" || value === "0x") {
    throw new Error(`Invalid address value: ${value}`);
  }

  let address = value;
  if (address.length === 66) {
    address = "0x" + address.slice(-40);
  }

  if (address === ZERO_ADDRESS) {
    throw new Error("Empty address");
  }

  return toChecksumAddress(zHexAddr20.parse(address));
};

const EIP_1167_BYTECODE_PREFIX = "0x363d3d373d3d3d363d";
const EIP_1167_BYTECODE_SUFFIX = "57fd5bf3";
const EIP_1167_ERROR_MSG = "Invalid EIP-1167 bytecode";
const SUFFIX_OFFSET_FROM_ADDRESS_END = 22;

export const parse1167Bytecode = (bytecode: unknown): Hex => {
  if (
    typeof bytecode !== "string" ||
    !bytecode.startsWith(EIP_1167_BYTECODE_PREFIX)
  ) {
    throw new Error(EIP_1167_ERROR_MSG);
  }

  // detect length of address (20 bytes non-optimized, 0 < N < 20 bytes for vanity addresses)
  const pushNHex = bytecode.substring(
    EIP_1167_BYTECODE_PREFIX.length,
    EIP_1167_BYTECODE_PREFIX.length + 2
  );
  // push1 ... push20 use opcodes 0x60 ... 0x73
  const addressLength = parseInt(pushNHex, 16) - 0x5f;

  if (addressLength < 1 || addressLength > 20) {
    throw new Error(EIP_1167_ERROR_MSG);
  }

  const addressFromBytecode = bytecode.substring(
    EIP_1167_BYTECODE_PREFIX.length + 2,
    EIP_1167_BYTECODE_PREFIX.length + 2 + addressLength * 2 // address length is in bytes, 2 hex chars make up 1 byte
  );

  if (
    !bytecode
      .substring(
        EIP_1167_BYTECODE_PREFIX.length +
          2 +
          addressLength * 2 +
          SUFFIX_OFFSET_FROM_ADDRESS_END
      )
      .startsWith(EIP_1167_BYTECODE_SUFFIX)
  ) {
    throw new Error(EIP_1167_ERROR_MSG);
  }

  // padStart is needed for vanity addresses
  return zHex.parse(`0x${addressFromBytecode.padStart(40, "0")}`);
};
