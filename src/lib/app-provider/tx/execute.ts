import type { Coin, StdFee } from "@cosmjs/stargate";
import type { Activity } from "lib/stores/contract";
import type { BechAddr32 } from "lib/types";

import { Coins, MsgExecuteContract } from "@initia/initia.js";
import { trackTxSucceed } from "lib/amplitude";
import { executeContractTx } from "lib/app-fns/tx/execute";
import { libEncode, toEncodeObject } from "lib/utils";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface ExecuteStreamParams {
  estimatedFee: StdFee | undefined;
  contractAddress: BechAddr32;
  msg: string | object;
  funds: Coin[];
  onTxSucceed?: (activity: Activity) => void;
  onTxFailed?: () => void;
}

export const useExecuteContractTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      contractAddress,
      estimatedFee,
      funds,
      msg,
      onTxFailed,
      onTxSucceed,
    }: ExecuteStreamParams) => {
      if (!address)
        throw new Error("No address provided (useExecuteContractTx)");
      if (!estimatedFee) return null;

      const coins = new Coins();
      funds.forEach((coin) => coins.set(coin.denom, coin.amount));

      const messages = toEncodeObject([
        new MsgExecuteContract(
          address,
          contractAddress,
          libEncode(JSON.stringify(msg)),
          coins
        ),
      ]);

      const base64Message = libEncode(JSON.stringify({ funds, msg }));

      const action = typeof msg === "string" ? msg : Object.keys(msg)[0];
      return executeContractTx({
        action,
        address,
        base64Message,
        contractAddress,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: (activity) => {
          trackTxSucceed();
          onTxSucceed?.(activity);
        },
        signAndBroadcast,
      });
    },
    [address, signAndBroadcast]
  );
};
