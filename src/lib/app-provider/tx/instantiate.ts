import type { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import type { BechAddr32, Coin } from "lib/types";

import { Coins, MsgInstantiateContract } from "@initia/initia.js";
import { trackTxSucceed } from "lib/amplitude";
import { instantiateContractTx } from "lib/app-fns/tx/instantiate";
import { libEncode, toEncodeObject } from "lib/utils";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface InstantiateStreamParams {
  estimatedFee: StdFee | undefined;
  codeId: number;
  initMsg: object;
  label: string;
  admin: string;
  funds: Coin[];
  onTxSucceed?: (
    txResult: DeliverTxResponse,
    contractLabel: string,
    contractAddress: BechAddr32
  ) => void;
  onTxFailed?: () => void;
}

export const useInstantiateContractTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      estimatedFee,
      codeId,
      initMsg,
      label,
      admin,
      funds,
      onTxSucceed,
      onTxFailed,
    }: InstantiateStreamParams) => {
      if (!address)
        throw new Error("No address provided (useInstantiatetContractTx)");
      if (!estimatedFee) return null;

      const messages = toEncodeObject([
        new MsgInstantiateContract(
          address,
          admin,
          codeId,
          label,
          libEncode(JSON.stringify(initMsg)),
          Coins.fromData(funds)
        ),
      ]);

      return instantiateContractTx({
        address,
        messages,
        label,
        fee: estimatedFee,
        signAndBroadcast,
        onTxSucceed: (txResult, contractLabel, contractAddress) => {
          trackTxSucceed();
          onTxSucceed?.(txResult, contractLabel, contractAddress);
        },
        onTxFailed,
      });
    },
    [address, signAndBroadcast]
  );
};
