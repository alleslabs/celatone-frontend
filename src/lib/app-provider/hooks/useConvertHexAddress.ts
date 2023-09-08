import { useCallback } from "react";

import type { HexAddr } from "lib/types";
import { hexToBech32Address } from "lib/utils";

import { useCurrentChain } from "./useCurrentChain";

export const useConvertHexAddress = () => {
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();

  return useCallback(
    (hexAddr: HexAddr) => hexToBech32Address(bech32Prefix, hexAddr),
    [bech32Prefix]
  );
};
