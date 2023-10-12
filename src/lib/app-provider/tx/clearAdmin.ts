import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { CELATONE_QUERY_KEYS } from "../env";
import { useCurrentChain, useFabricateFee, useWasmConfig } from "../hooks";
import { useTrack } from "lib/amplitude";
import { clearAdminTx } from "lib/app-fns/tx/clearAdmin";
import type { ContractAddr, HumanAddr } from "lib/types";

import { useCatchTxError } from "./catchTxError";

export interface ClearAdminStreamParams {
  onTxSucceed?: () => void;
}

export const useClearAdminTx = (contractAddress: ContractAddr) => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();
  const queryClient = useQueryClient();
  const fabricateFee = useFabricateFee();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const { trackTxSucceed } = useTrack();
  const catchTxError = useCatchTxError();

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
          trackTxSucceed();
          onTxSucceed?.();
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: [CELATONE_QUERY_KEYS.ADMINS_BY_CONTRACTS],
            }),
            queryClient.invalidateQueries({
              queryKey: [CELATONE_QUERY_KEYS.CONTRACT_INSTANTIATE_DETAIL],
            }),
          ]);
        },
        catchTxError,
      });
    },
    [
      getSigningCosmWasmClient,
      trackTxSucceed,
      catchTxError,
      address,
      wasm,
      fabricateFee,
      contractAddress,
      queryClient,
    ]
  );
};
