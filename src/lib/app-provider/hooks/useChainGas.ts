import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

import { FALLBACK_GAS_REGISTRY } from "lib/data";
import type { ChainGas, Gas } from "lib/types";

export const useChainGas = (): ChainGas => {
  const { currentChainRecord, currentChainName } = useWallet();

  return useMemo(() => {
    if (
      !currentChainRecord ||
      !currentChainRecord.chain.fees ||
      !currentChainRecord.chain.fees.fee_tokens[0].average_gas_price
    )
      return FALLBACK_GAS_REGISTRY[currentChainName];
    return {
      denom: currentChainRecord.chain.fees?.fee_tokens[0].denom as string,
      gasPrice: currentChainRecord.chain.fees?.fee_tokens[0]
        .average_gas_price as Gas<number>,
    };
  }, [currentChainRecord, currentChainName]);
};
