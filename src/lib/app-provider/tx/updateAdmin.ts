import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { updateAdminTx } from "lib/app-fns/tx/updateAdmin";
import type { ContractAddr, HumanAddr } from "lib/types";

export interface UpdateAdminStreamParams {
  contractAddress: ContractAddr;
  newAdmin: HumanAddr | ContractAddr;
  estimatedFee: StdFee | undefined;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useUpdateAdminTx = () => {
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({
      contractAddress,
      newAdmin,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
    }: UpdateAdminStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return updateAdminTx({
        address: address as HumanAddr,
        contractAddress,
        newAdmin,
        fee: estimatedFee,
        client,
        onTxSucceed,
        onTxFailed,
      });
    },
    [address, getCosmWasmClient]
  );
};
