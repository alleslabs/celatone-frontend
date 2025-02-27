import type { StdFee } from "@cosmjs/stargate";
import { MsgUpdateAdmin } from "@initia/initia.js";
import { useCallback } from "react";

import { trackTxSucceed } from "lib/amplitude";
import { updateAdminTx } from "lib/app-fns/tx/updateAdmin";
import type { BechAddr, BechAddr32, Option } from "lib/types";
import { toEncodeObject } from "lib/utils";
import { useCurrentChain, useSignAndBroadcast } from "../hooks";

export interface UpdateAdminStreamParams {
  contractAddress: BechAddr32;
  newAdmin: BechAddr;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useUpdateAdminTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      contractAddress,
      newAdmin,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: UpdateAdminStreamParams) => {
      if (!address) throw new Error("No address provided (useUpdateAdminTx)");

      if (!estimatedFee) return null;

      const messages = toEncodeObject([
        new MsgUpdateAdmin(address, newAdmin, contractAddress),
      ]);

      return updateAdminTx({
        address,
        messages,
        fee: estimatedFee,
        signAndBroadcast,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, signAndBroadcast]
  );
};
