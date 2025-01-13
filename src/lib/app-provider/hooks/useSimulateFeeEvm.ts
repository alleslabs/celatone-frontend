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
      try {
        // If the user has connected with Initia Widget
        if (walletProvider.type === "initia-widget") {
          const { estimateEthereumTx } = walletProvider.context;
          const gas = await estimateEthereumTx(request, chainId).then(
            zGas(zBig).parse
          );
          return gas;
        }
        throw new Error("Unsupported wallet provider (useSimulateFeeEvm)");
      } catch {
        return zGas(zBig).parse(0);
      }
    },
    [chainId, walletProvider.context, walletProvider.type]
  );
};
