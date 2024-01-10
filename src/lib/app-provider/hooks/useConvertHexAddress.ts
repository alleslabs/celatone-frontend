import { useCallback } from "react";

import { HEX_MODULE_ADDRESS_LENGTH, HEX_WALLET_ADDRESS_LENGTH } from "lib/data";
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
        hexToBech32Address(bech32Prefix, hexAddr, HEX_WALLET_ADDRESS_LENGTH),
      [bech32Prefix]
    ),
    convertHexModuleAddress: useCallback(
      (hexAddr: HexAddr) =>
        hexToBech32Address(bech32Prefix, hexAddr, HEX_MODULE_ADDRESS_LENGTH),
      [bech32Prefix]
    ),
  };
};
