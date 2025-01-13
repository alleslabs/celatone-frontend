import { useCallback } from "react";

import type { Gas } from "lib/types";
import { zBig, zGas } from "lib/types";

import Big from "big.js";
import { TransactionRequest } from "ethers";
import { useCurrentChain } from "./useCurrentChain";

export const useSimulateFeeEvm = () => {
  const { chainId, walletProvider } = useCurrentChain();

  return useCallback(
    async (request: TransactionRequest): Promise<Gas<Big>> => {
      // If the user has connected with Initia Widget
      if (walletProvider.type === "initia-widget") {
        const { estimateEthereumTx } = walletProvider.context;
        return estimateEthereumTx(request, chainId).then(zGas(zBig).parse);
      }

      throw new Error("Unsupported wallet provider");
    },
    [chainId, walletProvider.context, walletProvider.type]
  );
};
