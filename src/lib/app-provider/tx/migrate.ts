// import { toUtf8 } from "@cosmjs/encoding";
import type { StdFee } from "@cosmjs/stargate";
import { MsgMigrateContract } from "@initia/initia.js";
// import { MsgMigrateContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
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

      // const messages = [
      //   {
      //     typeUrl: "/cosmwasm.wasm.v1.MsgMigrateContract",
      //     value: MsgMigrateContract.fromPartial({
      //       sender: address,
      //       contract: contractAddress,
      //       codeId: BigInt(codeId.toString()),
      //       msg: toUtf8(JSON.stringify(migrateMsg)),
      //     }),
      //   },
      // ];

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
