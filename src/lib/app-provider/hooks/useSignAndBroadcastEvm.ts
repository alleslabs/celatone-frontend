import type { TxReceiptJsonRpc } from "lib/services/types";
import type { Hex } from "viem";

import { getEthGetTransactionReceipt } from "lib/services/evm/json-rpc";
import { convertCosmosChainIdToEvmChainId, sleep } from "lib/utils";
import { useCallback } from "react";
import { parseEther } from "viem";
import { useSendTransaction, useSwitchChain } from "wagmi";

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
    const result = await getEthGetTransactionReceipt(
      jsonRpcEndpoint,
      txHash
    ).catch(() => undefined);
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

type SignAndBroadcastEvmRequest = {
  data: string;
  to: string;
  value: string;
};

export type SignAndBroadcastEvm = (
  request: SignAndBroadcastEvmRequest
) => Promise<TxReceiptJsonRpc>;

export const useSignAndBroadcastEvm = () => {
  const {
    chainConfig: {
      chainId: cosmosChainId,
      features: { evm },
    },
  } = useCelatoneApp();
  const { walletProvider } = useCurrentChain();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();

  return useCallback(
    async (request: SignAndBroadcastEvmRequest): Promise<TxReceiptJsonRpc> => {
      if (evm.enabled && walletProvider.type === "initia-widget") {
        const evmChainId = convertCosmosChainIdToEvmChainId(cosmosChainId);
        await switchChainAsync({ chainId: evmChainId });

        const txHash = await sendTransactionAsync({
          chainId: evmChainId,
          data: request.data as Hex,
          to: request.to as Hex,
          value: parseEther(request.value),
        });
        return getEvmTxResponse(evm.jsonRpc, txHash);
      }
      throw new Error("Unsupported wallet provider (useSignAndBroadcastEvm)");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      cosmosChainId,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      evm.enabled && evm.jsonRpc,
      walletProvider.context,
      walletProvider.type,
    ]
  );
};
