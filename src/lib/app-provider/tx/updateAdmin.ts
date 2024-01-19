import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain, useGetSigningClient } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { updateAdminTx } from "lib/app-fns/tx/updateAdmin";
import type { BechAddr, BechAddr32, Option } from "lib/types";

export interface UpdateAdminStreamParams {
  contractAddress: BechAddr32;
  newAdmin: BechAddr;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useUpdateAdminTx = () => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();

  return useCallback(
    async ({
      contractAddress,
      newAdmin,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: UpdateAdminStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return updateAdminTx({
        address,
        contractAddress,
        newAdmin,
        fee: estimatedFee,
        client,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, getSigningClient]
  );
};
