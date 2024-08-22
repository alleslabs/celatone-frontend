import type { Coin, DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { Coins, MsgInstantiateContract } from "@initia/initia.js";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { instantiateContractTx } from "lib/app-fns/tx/instantiate";
import type { BechAddr32, Option } from "lib/types";
import { libEncode, toEncodeObject } from "lib/utils";

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
    contractAddress: Option<BechAddr32>
  ) => void;
  onTxFailed?: () => void;
}

export const useInstantiateTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

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
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      const coins = new Coins();
      funds.forEach((coin) => coins.set(coin.denom, coin.amount));

      const messages = toEncodeObject([
        new MsgInstantiateContract(
          address,
          admin,
          codeId,
          label,
          libEncode(JSON.stringify(initMsg)),
          coins
        ),
      ]);

      return instantiateContractTx({
        address,
        messages,
        label,
        fee: estimatedFee,
        client,
        onTxSucceed: (txResult, contractLabel, contractAddress) => {
          trackTxSucceed();
          onTxSucceed?.(txResult, contractLabel, contractAddress);
        },
        onTxFailed,
      });
    },
    [address, getSigningClient]
  );
};
