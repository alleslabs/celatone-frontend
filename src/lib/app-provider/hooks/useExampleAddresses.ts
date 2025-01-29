import { toBech32, toHex } from "@cosmjs/encoding";
import { useMemo } from "react";

import type { BechAddr20, BechAddr32 } from "lib/types";
import { addrToValoper } from "lib/utils";

import { useCurrentChain } from "./useCurrentChain";

export const useExampleAddresses = () => {
  const { bech32Prefix } = useCurrentChain();

  const generateExampleAddresses = () => {
    const bytes32 = Array.from(Array(32).keys());
    const bytes20 = bytes32.slice(0, 20);
    const user = toBech32(bech32Prefix, Uint8Array.from(bytes20)) as BechAddr20;

    // reverse the bytes so the initial characters are different from the user address
    const evmContract = "0x" + toHex(Uint8Array.from(bytes20).reverse());
    const contract = toBech32(
      bech32Prefix,
      Uint8Array.from(bytes32.reverse())
    ) as BechAddr32;

    const validator = addrToValoper(user);

    return {
      user,
      contract,
      evmContract,
      validator,
    };
  };

  return useMemo(generateExampleAddresses, [bech32Prefix]);
};
