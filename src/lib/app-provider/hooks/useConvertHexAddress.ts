import { useCallback } from "react";

import { HEX_32_ADDRESS_LENGTH, HEX_20_ADDRESS_LENGTH } from "lib/data";
import type { HexAddr } from "lib/types";
import { hexToBech32Address } from "lib/utils";

import { useCurrentChain } from "./useCurrentChain";

export const useConvertHexAddress = () => {
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();

  return {
    convertHexWalletAddress: useCallback(
      (hexAddr: HexAddr) =>
        hexToBech32Address(bech32Prefix, hexAddr, HEX_20_ADDRESS_LENGTH),
      [bech32Prefix]
    ),
    convertHexModuleAddress: useCallback(
      (hexAddr: HexAddr) =>
        hexToBech32Address(bech32Prefix, hexAddr, HEX_32_ADDRESS_LENGTH),
      [bech32Prefix]
    ),
  };
};
