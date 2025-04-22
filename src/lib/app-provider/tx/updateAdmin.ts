import type { StdFee } from "@cosmjs/stargate";
import type { BechAddr, BechAddr32, Option } from "lib/types";

import { MsgUpdateAdmin } from "@initia/initia.js";
import { trackTxSucceed } from "lib/amplitude";
import { updateAdminTx } from "lib/app-fns/tx/updateAdmin";
import { toEncodeObject } from "lib/utils";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface UpdateAdminStreamParams {
  contractAddress: BechAddr32;
  estimatedFee: Option<StdFee>;
  newAdmin: BechAddr;
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
}

export const useUpdateAdminTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      contractAddress,
      estimatedFee,
      newAdmin,
      onTxFailed,
      onTxSucceed,
    }: UpdateAdminStreamParams) => {
      if (!address) throw new Error("No address provided (useUpdateAdminTx)");

      if (!estimatedFee) return null;

      const messages = toEncodeObject([
        new MsgUpdateAdmin(address, newAdmin, contractAddress),
      ]);

      return updateAdminTx({
        address,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        signAndBroadcast,
      });
    },
    [address, signAndBroadcast]
  );
};
