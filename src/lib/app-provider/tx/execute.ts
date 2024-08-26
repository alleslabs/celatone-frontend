import type { Coin, StdFee } from "@cosmjs/stargate";
import { Coins, MsgExecuteContract } from "@initia/initia.js";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { executeContractTx } from "lib/app-fns/tx/execute";
import type { Activity } from "lib/stores/contract";
import type { BechAddr32 } from "lib/types";
import { libEncode, toEncodeObject } from "lib/utils";

export interface ExecuteStreamParams {
  onTxSucceed?: (activity: Activity) => void;
  onTxFailed?: () => void;
  estimatedFee: StdFee | undefined;
  contractAddress: BechAddr32;
  msg: string | object;
  funds: Coin[];
}

export const useExecuteContractTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      contractAddress,
      msg,
      funds,
    }: ExecuteStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
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

      const base64Message = libEncode(JSON.stringify({ msg, funds }));

      const action = typeof msg === "string" ? msg : Object.keys(msg)[0];
      return executeContractTx({
        address,
        contractAddress,
        messages,
        action,
        fee: estimatedFee,
        base64Message,
        client,
        onTxSucceed: (activity) => {
          trackTxSucceed();
          onTxSucceed?.(activity);
        },
        onTxFailed,
      });
    },
    [address, getSigningClient]
  );
};
