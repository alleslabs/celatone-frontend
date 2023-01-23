import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { migrateContractTx } from "lib/app-fns/tx/migrate";
import type { ContractAddr, Option } from "lib/types";

export interface MigrateStreamParams {
  contractAddress: ContractAddr;
  codeId: number;
  migrateMsg: object;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: (txHash: string) => void;
}

export const useMigrateTx = () => {
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({
      contractAddress,
      codeId,
      migrateMsg,
      estimatedFee,
      onTxSucceed,
    }: MigrateStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return migrateContractTx({
        sender: address,
        contractAddress,
        codeId,
        migrateMsg,
        fee: estimatedFee,
        client,
        onTxSucceed,
      });
    },
    [address, getCosmWasmClient]
  );
};
