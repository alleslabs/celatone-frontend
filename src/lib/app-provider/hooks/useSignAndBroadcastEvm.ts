import { useCallback } from "react";

import { TransactionRequest } from "ethers";
import { useCurrentChain } from "./useCurrentChain";

export const useSignAndBroadcastEvm = () => {
  const { walletProvider, chainId } = useCurrentChain();

  return useCallback(
    async (request: TransactionRequest): Promise<string> => {
      try {
        if (walletProvider.type === "initia-widget") {
          const { requestEthereumTx } = walletProvider.context;
          const result = await requestEthereumTx(request, { chainId });
          return result;
        }
        throw new Error("Unsupported wallet provider (useSignAndBroadcastEvm)");
      } catch {
        return "";
      }
    },
    [chainId, walletProvider.context, walletProvider.type]
  );
};
