import type { StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { updateAdminTx } from "lib/app-fns/tx/updateAdmin";
import type { Addr, ContractAddr, HumanAddr, Option } from "lib/types";

export interface UpdateAdminStreamParams {
  contractAddress: ContractAddr;
  newAdmin: Addr;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useUpdateAdminTx = () => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();

  return useCallback(
    async ({
      contractAddress,
      newAdmin,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: UpdateAdminStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return updateAdminTx({
        address: address as HumanAddr,
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
    [address, getSigningCosmWasmClient]
  );
};
