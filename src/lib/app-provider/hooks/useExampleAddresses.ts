import type { BechAddr20, BechAddr32 } from "lib/types";

import { toBech32 } from "@cosmjs/encoding";
import { addrToValoper } from "lib/utils";
import { useMemo } from "react";

import { useCurrentChain } from "./useCurrentChain";

export const useExampleAddresses = () => {
  const { bech32Prefix } = useCurrentChain();

  const generateExampleAddresses = () => {
    const bytes32 = Array.from(Array(32).keys());
    const bytes20 = bytes32.slice(0, 20);
    const user = toBech32(bech32Prefix, Uint8Array.from(bytes20)) as BechAddr20;

    const contract = toBech32(
      bech32Prefix,
      Uint8Array.from(bytes32.reverse())
    ) as BechAddr32;

    const validator = addrToValoper(user);

    return {
      contract,
      user,
      validator,
    };
  };

  return useMemo(generateExampleAddresses, [bech32Prefix]);
};
