import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCurrentChain, useFabricateFee, useWasmConfig } from "../hooks";
import { clearAdminTx } from "lib/app-fns/tx/clearAdmin";
import type { ContractAddr, HumanAddr } from "lib/types";

export interface ClearAdminStreamParams {
  onTxSucceed?: () => void;
}

export const useClearAdminTx = (contractAddress: ContractAddr) => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  const queryClient = useQueryClient();
  const fabricateFee = useFabricateFee();
  const wasm = useWasmConfig({ shouldRedirect: false });

  return useCallback(
    async ({ onTxSucceed }: ClearAdminStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");

      if (!wasm.enabled)
        throw new Error(
          "Wasm config isn't loaded or Wasm feature is disabled."
        );

      const clearAdminFee = fabricateFee(wasm.clearAdminGas);

      return clearAdminTx({
        address: address as HumanAddr,
        contractAddress,
        fee: clearAdminFee,
        client,
        onTxSucceed: () => {
          onTxSucceed?.();
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["admin_by_contracts"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["query", "instantiate_info"],
            }),
          ]);
        },
      });
    },
    [
      getSigningCosmWasmClient,
      address,
      wasm,
      fabricateFee,
      contractAddress,
      queryClient,
    ]
  );
};
