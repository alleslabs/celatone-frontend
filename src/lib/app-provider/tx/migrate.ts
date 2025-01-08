import type { StdFee } from "@cosmjs/stargate";
import { MsgMigrateContract } from "@initia/initia.js";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { migrateContractTx } from "lib/app-fns/tx/migrate";
import type { BechAddr32, Option } from "lib/types";
import { libEncode, toEncodeObject } from "lib/utils";

export interface MigrateStreamParams {
  codeId: number;
  contractAddress: BechAddr32;
  estimatedFee: Option<StdFee>;
  migrateMsg: object;
  onTxFailed?: () => void;
  onTxSucceed?: (txHash: string) => void;
}

export const useMigrateContractTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      codeId,
      contractAddress,
      estimatedFee,
      migrateMsg,
      onTxFailed,
      onTxSucceed,
    }: MigrateStreamParams) => {
      if (!address)
        throw new Error("No address provided (useMigrateContractTx)");
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
        address,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        signAndBroadcast,
      });
    },
    [address, signAndBroadcast]
  );
};
