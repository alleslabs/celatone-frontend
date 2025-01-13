import { useCallback } from "react";

import { TransactionRequest } from "ethers";
import { useCurrentChain } from "./useCurrentChain";

export const useSignAndBroadcastEvm = () => {
  const { walletProvider, chainId } = useCurrentChain();

  return useCallback(
    async (request: TransactionRequest): Promise<string> => {
      if (walletProvider.type === "initia-widget") {
        const { requestEthereumTx } = walletProvider.context;
        return requestEthereumTx(request, { chainId });
      }
      throw new Error("Unsupported wallet provider");
    },
    [chainId, walletProvider.context, walletProvider.type]
  );
};
