import { useCallback } from "react";

import { TransactionRequest } from "ethers";
import { requestJsonRpc } from "lib/services/evm/jsonRpc";
import { TxReceiptJsonRpc, zTxReceiptJsonRpc } from "lib/services/types";
import {
  convertCosmosChainIdToEvmChainId,
  parseWithError,
  sleep,
} from "lib/utils";
import { useCelatoneApp } from "../contexts";
import { useCurrentChain } from "./useCurrentChain";

const getEvmTxResponse = async (jsonRpcEndpoint: string, txHash: string) => {
  const TIME_OUT_MS = 3000;
  const POLL_INTERVAL_MS = 1000;

  let timedOut = false;
  const txPollTimeout = setTimeout(() => {
    timedOut = true;
  }, TIME_OUT_MS);

  const pollForEvmTx = async (_txHash: string): Promise<TxReceiptJsonRpc> => {
    if (timedOut) {
      throw new Error(
        `Transaction with hash ${_txHash} was submitted but was not yet found on the chain. You might want to check later. There was a wait of ${
          TIME_OUT_MS / 1000
        } seconds.`
      );
    }
    await sleep(POLL_INTERVAL_MS);
    const result = await requestJsonRpc(
      jsonRpcEndpoint,
      "eth_getTransactionReceipt",
      [txHash]
    )
      .then((result) => parseWithError(zTxReceiptJsonRpc, result))
      .catch(() => undefined);
    return result ? result : pollForEvmTx(_txHash);
  };

  return new Promise<TxReceiptJsonRpc>((resolve, reject) => {
    pollForEvmTx(txHash).then(
      (value) => {
        clearTimeout(txPollTimeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(txPollTimeout);
        reject(error);
      }
    );
  });
};

export type SignAndBroadcastEvm = (
  request: TransactionRequest
) => Promise<TxReceiptJsonRpc>;

export const useSignAndBroadcastEvm = () => {
  const { walletProvider, chainId } = useCurrentChain();
  const {
    chainConfig: {
      features: { evm },
    },
  } = useCelatoneApp();

  return useCallback(
    async (request: TransactionRequest): Promise<TxReceiptJsonRpc> => {
      if (evm.enabled && walletProvider.type === "initia-widget") {
        const { requestEthereumTx, ethereum } = walletProvider.context;
        const evmChainId = convertCosmosChainIdToEvmChainId(chainId);

        await ethereum?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: evmChainId }],
        });
        const txHash = await requestEthereumTx(
          { ...request, chainId: evmChainId },
          { chainId }
        );
        return getEvmTxResponse(evm.jsonRpc, txHash);
      }
      throw new Error("Unsupported wallet provider (useSignAndBroadcastEvm)");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      chainId,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      evm.enabled && evm.jsonRpc,
      walletProvider.context,
      walletProvider.type,
    ]
  );
};
