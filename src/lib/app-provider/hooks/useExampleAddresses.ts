import { toBech32 } from "@cosmjs/encoding";
import { useMemo } from "react";

import type { ContractAddr, HumanAddr } from "lib/types";
import { addrToValoper } from "lib/utils";

import { useCurrentChain } from "./useCurrentChain";

export const useExampleAddresses = () => {
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  const generateExampleAddresses = () => {
    const bytes = Array.from(Array(32).keys());
    const user = toBech32(
      prefix,
      new Uint8Array(bytes.slice(0, 20))
    ) as HumanAddr;

    // reverse the bytes so the initial characters are different from the user address
    const contract = toBech32(
      prefix,
      new Uint8Array(bytes.reverse())
    ) as ContractAddr;

    const validator = addrToValoper(user);

    return {
      user,
      contract,
      validator,
    };
  };

  return useMemo(generateExampleAddresses, [prefix]);
};
