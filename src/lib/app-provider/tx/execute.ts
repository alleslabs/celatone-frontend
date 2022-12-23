import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { executeContractTx } from "lib/app-fns/tx/execute";
import { useUserKey } from "lib/hooks/useUserKey";
import type { Activity } from "lib/stores/contract";
import type { ContractAddr } from "lib/types";

export interface ExecuteStreamParams {
  onTxSucceed?: (userKey: string, activity: Activity) => void;
  onTxFailed?: () => void;
  estimatedFee: StdFee | undefined;
  contractAddr: ContractAddr;
  msg: object;
}

export const useExecuteContractTx = () => {
  const { address, getCosmWasmClient } = useWallet();
  const userKey = useUserKey();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      contractAddr,
      msg,
    }: ExecuteStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return executeContractTx({
        address,
        contractAddr,
        fee: estimatedFee,
        msg,
        client,
        userKey,
        onTxSucceed,
        onTxFailed,
      });
    },
    [address, userKey, getCosmWasmClient]
  );
};
