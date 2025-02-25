import type { StdFee } from "@cosmjs/stargate";
import { MsgMigrateContract } from "@initia/initia.js";
import { useCallback } from "react";

import { trackTxSucceed } from "lib/amplitude";
import { migrateContractTx } from "lib/app-fns/tx/migrate";
import type { BechAddr32, Option } from "lib/types";
import { libEncode, toEncodeObject } from "lib/utils";
import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface MigrateStreamParams {
  contractAddress: BechAddr32;
  codeId: number;
  migrateMsg: object;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: (txHash: string) => void;
  onTxFailed?: () => void;
}

export const useMigrateContractTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      contractAddress,
      codeId,
      migrateMsg,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
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
        messages,
        fee: estimatedFee,
        signAndBroadcast,
        onTxSucceed: (txHash) => {
          trackTxSucceed();
          onTxSucceed?.(txHash);
        },
        onTxFailed,
      });
    },
    [address, signAndBroadcast]
  );
};
