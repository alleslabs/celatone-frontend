import type { Coin, StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { executeContractTx } from "lib/app-fns/tx/execute";
import { useUserKey } from "lib/hooks/useUserKey";
import type { Activity } from "lib/stores/contract";
import type { ContractAddr, HumanAddr } from "lib/types";

export interface ExecuteStreamParams {
  onTxSucceed?: (userKey: string, activity: Activity) => void;
  onTxFailed?: () => void;
  estimatedFee: StdFee | undefined;
  contractAddress: ContractAddr;
  msg: object;
  funds: Coin[];
}

export const useExecuteContractTx = () => {
  const { address, getCosmWasmClient } = useWallet();
  const userKey = useUserKey();

  return useCallback(
    async ({
      onTxSucceed,
      onTxFailed,
      estimatedFee,
      contractAddress,
      msg,
      funds,
    }: ExecuteStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return executeContractTx({
        address: address as HumanAddr,
        contractAddress,
        fee: estimatedFee,
        msg,
        funds,
        client,
        userKey,
        onTxSucceed,
        onTxFailed,
      });
    },
    [address, userKey, getCosmWasmClient]
  );
};
