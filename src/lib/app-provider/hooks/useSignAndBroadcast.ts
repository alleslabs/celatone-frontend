import type { StdFee } from "@cosmjs/amino";
import type { EncodeObject } from "@cosmjs/proto-signing";
import type { DeliverTxResponse } from "@cosmjs/stargate";
import type { BechAddr20 } from "lib/types";

import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { sleep } from "lib/utils";
import { useCallback } from "react";

import { useCelatoneApp } from "../contexts";
import { useCurrentChain } from "./useCurrentChain";
import { useGetSigningClient } from "./useGetSigningClient";

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
          events: result.events,
          gasUsed: result.gasUsed,
          gasWanted: result.gasWanted,
          height: result.height,
          msgResponses: result.msgResponses,
          rawLog: result.rawLog,
          transactionHash: _txHash,
          txIndex: result.txIndex,
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
  fee: StdFee;
  messages: EncodeObject[];
}

export type SignAndBroadcast = (
  params: SignAndBroadcastParams
) => Promise<DeliverTxResponse>;

export const useSignAndBroadcast = () => {
  const { chainId, walletProvider } = useCurrentChain();
  const {
    chainConfig: { rpc: rpcEndpoint },
  } = useCelatoneApp();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      address,
      fee,
      messages,
    }: SignAndBroadcastParams): Promise<DeliverTxResponse> => {
      if (walletProvider.type === "initia-widget") {
        const { requestTxBlock } = walletProvider.context;
        const txResponse = await requestTxBlock({ chainId, messages });
        return getTxResponse(rpcEndpoint, txResponse.transactionHash);
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
