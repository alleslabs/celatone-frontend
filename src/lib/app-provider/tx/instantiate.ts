import type { InstantiateResult } from "@cosmjs/cosmwasm-stargate";
import type { Coin, StdFee } from "@cosmjs/stargate";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
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
  const { address, getSigningCosmWasmClient } = useCurrentChain();

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
      const client = await getSigningCosmWasmClient();
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
    [address, getSigningCosmWasmClient]
  );
};
