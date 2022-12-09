import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { instantiateContractTx } from "lib/app-fns/tx/instantiate";

export interface InstantiateStreamParams {
  onTxSucceed?: (txResult: InstantiateResult, contractLabel: string) => void;
  estimatedFee: StdFee | undefined;
  codeId: number;
  initMsg: object;
  label: string;
  admin: string;
  funds: Coin[];
}

export const useInstantiateTx = () => {
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({
      onTxSucceed,
      estimatedFee,
      codeId,
      initMsg,
      label,
      admin,
      funds,
    }: InstantiateStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!estimatedFee) return null;

      return instantiateContractTx({
        address,
        codeId,
        initMsg,
        label,
        fee: estimatedFee,
        admin,
        funds,
        client,
        onTxSucceed,
      });
    },
    [address, getCosmWasmClient]
  );
};
