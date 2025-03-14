import type { StdFee } from "@cosmjs/amino";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse } from "@cosmjs/stargate";
import { useCallback } from "react";

import type { BechAddr20 } from "lib/types";
import { sleep } from "lib/utils";

import { useCurrentChain } from "./useCurrentChain";
import { useGetSigningClient } from "./useGetSigningClient";
import { useCelatoneApp } from "../contexts";

const getTxResponse = async (rpcEndpoint: string, txHash: string) => {
  const TIME_OUT_MS = 3000;
  const POLL_INTERVAL_MS = 1000;

  const client = await CosmWasmClient.connect(rpcEndpoint);

  let timedOut = false;
  const txPollTimeout = setTimeout(() => {
    timedOut = true;
  }, TIME_OUT_MS);

  const pollForTx = async (_txHash: string): Promise<DeliverTxResponse> => {
    if (timedOut) {
      throw new Error(
        `Transaction with hash ${_txHash} was submitted but was not yet found on the chain. You might want to check later. There was a wait of ${
          TIME_OUT_MS / 1000
        } seconds.`
      );
    }
    await sleep(POLL_INTERVAL_MS);
    const result = await client.getTx(_txHash);
    return result
      ? {
          code: result.code,
          height: result.height,
          txIndex: result.txIndex,
          rawLog: result.rawLog,
          transactionHash: _txHash,
          events: result.events,
          msgResponses: result.msgResponses,
          gasUsed: result.gasUsed,
          gasWanted: result.gasWanted,
        }
      : pollForTx(_txHash);
  };

  return new Promise<DeliverTxResponse>((resolve, reject) => {
    pollForTx(txHash).then(
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

interface SignAndBroadcastParams {
  address: BechAddr20;
  messages: EncodeObject[];
  fee: StdFee;
}

export type SignAndBroadcast = (
  params: SignAndBroadcastParams
) => Promise<DeliverTxResponse>;

export const useSignAndBroadcast = () => {
  const { walletProvider, chainId } = useCurrentChain();
  const {
    chainConfig: { rpc: rpcEndpoint },
  } = useCelatoneApp();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      address,
      messages,
      fee,
    }: SignAndBroadcastParams): Promise<DeliverTxResponse> => {
      if (walletProvider.type === "initia-widget") {
        const { requestTx } = walletProvider.context;
        const txHash = await requestTx({ messages }, { chainId });
        return getTxResponse(rpcEndpoint, txHash);
      }

      // cosmos-kit
      const client = await getSigningClient();
      return client.signAndBroadcast(address, messages, fee);
    },
    [
      walletProvider.type,
      walletProvider.context,
      getSigningClient,
      chainId,
      rpcEndpoint,
    ]
  );
};
