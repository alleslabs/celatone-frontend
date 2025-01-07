import { toBech32 } from "@cosmjs/encoding";
import { useMemo } from "react";

import type { BechAddr20, BechAddr32 } from "lib/types";
import { addrToValoper } from "lib/utils";

import { useCurrentChain } from "./useCurrentChain";

export const useExampleAddresses = () => {
  const { bech32Prefix } = useCurrentChain();

  const generateExampleAddresses = () => {
    const bytes = Array.from(Array(32).keys());
    const user = toBech32(
      bech32Prefix,
      Uint8Array.from(bytes.slice(0, 20))
    ) as BechAddr20;

    // reverse the bytes so the initial characters are different from the user address
    const contract = toBech32(
      bech32Prefix,
      Uint8Array.from(bytes.reverse())
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
