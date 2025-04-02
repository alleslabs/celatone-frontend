import type { BechAddr20, BechAddr32, HexAddr } from "lib/types";

import { HEX_MODULE_ADDRESS_LENGTH, HEX_WALLET_ADDRESS_LENGTH } from "lib/data";
import { hexToBech32Address } from "lib/utils";
import { useCallback } from "react";

import { useCurrentChain } from "./useCurrentChain";

export const useConvertHexAddress = () => {
  const { bech32Prefix } = useCurrentChain();

  return {
    convertHexWalletAddress: useCallback(
      (hexAddr: HexAddr) =>
        hexToBech32Address(
          bech32Prefix,
          hexAddr,
          HEX_WALLET_ADDRESS_LENGTH
        ) as BechAddr20,
      [bech32Prefix]
    ),
    convertHexModuleAddress: useCallback(
      (hexAddr: HexAddr) =>
        hexToBech32Address(
          bech32Prefix,
          hexAddr,
          HEX_MODULE_ADDRESS_LENGTH
        ) as BechAddr32,
      [bech32Prefix]
    ),
  };
};
