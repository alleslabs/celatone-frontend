import { useCallback } from "react";

import type { TransactionRequest } from "ethers";
import { getEthGetTransactionReceipt } from "lib/services/evm/json-rpc";
import type { TxReceiptJsonRpc } from "lib/services/types";
import { convertCosmosChainIdToEvmChainId, sleep } from "lib/utils";
import { useCelatoneApp } from "../contexts";
import { useCurrentChain } from "./useCurrentChain";
import { useEvmParams } from "lib/services/evm";

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

export type SignAndBroadcastEvm = (
  request: TransactionRequest
) => Promise<TxReceiptJsonRpc>;

export const useSignAndBroadcastEvm = () => {
  const {
    chainConfig: {
      prettyName,
      logo_URIs,
      features: { evm },
      registry,
    },
  } = useCelatoneApp();
  const { walletProvider, chainId } = useCurrentChain();
  const { data } = useEvmParams();

  return useCallback(
    async (request: TransactionRequest): Promise<TxReceiptJsonRpc> => {
      if (evm.enabled && walletProvider.type === "initia-widget") {
        const { requestEthereumTx, ethereum, wallet } = walletProvider.context;
        if (wallet?.type !== "evm")
          throw new Error("Please reconnect to EVM wallet");

        const evmChainId = "0x".concat(
          convertCosmosChainIdToEvmChainId(chainId).toString(16)
        );

        const feeDenom = data?.params.feeDenom.slice(-40) ?? "";
        const foundAsset = registry?.assets.find((asset) =>
          asset.denom_units.find(
            (denom_unit) => denom_unit.denom.slice(-40) === feeDenom
          )
        );

        if (foundAsset) {
          const denomUnit = foundAsset.denom_units.reduce((max, unit) =>
            unit.exponent > max.exponent ? unit : max
          );

          await ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: evmChainId,
                chainName: prettyName,
                iconUrls: Object.values(logo_URIs ?? {}),
                nativeCurrency: {
                  name: foundAsset.name,
                  symbol: foundAsset.symbol,
                  decimals: denomUnit.exponent,
                },
                rpcUrls: [evm.jsonRpc],
              },
            ],
          });
        }

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
