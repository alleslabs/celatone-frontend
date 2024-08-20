import type { StdFee } from "@cosmjs/stargate";
import { MsgMigrateContract } from "@initia/initia.js";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { migrateContractTx } from "lib/app-fns/tx/migrate";
import type { BechAddr32, Option } from "lib/types";
import { libEncode, toEncodeObject } from "lib/utils";

export interface MigrateStreamParams {
  contractAddress: BechAddr32;
  codeId: number;
  migrateMsg: object;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
}

export const useMigrateTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      contractAddress,
      codeId,
      migrateMsg,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: MigrateStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      const messages = toEncodeObject([
        new MsgMigrateContract(
          address,
          contractAddress,
          codeId,
          libEncode(JSON.stringify(migrateMsg))
        ),
      ]);

      return migrateContractTx({
        sender: address,
        messages,
        fee: estimatedFee,
        client,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        onTxFailed,
      });
    },
    [address, getSigningClient]
  );
};
