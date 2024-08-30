import { MsgClearAdmin } from "@initia/initia.js";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { CELATONE_QUERY_KEYS } from "../env";
import {
  useCurrentChain,
  useFabricateFee,
  useGetSigningClient,
  useWasmConfig,
} from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { clearAdminTx } from "lib/app-fns/tx/clearAdmin";
import type { BechAddr32 } from "lib/types";
import { toEncodeObject } from "lib/utils";

export interface ClearAdminStreamParams {
  onTxSucceed?: () => void;
}

export const useClearAdminTx = (contractAddress: BechAddr32) => {
  const { address } = useCurrentChain();
  const getSigningClient = useGetSigningClient();
  const queryClient = useQueryClient();
  const fabricateFee = useFabricateFee();
  const wasm = useWasmConfig({ shouldRedirect: false });

  return useCallback(
    async ({ onTxSucceed }: ClearAdminStreamParams) => {
      const client = await getSigningClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");

      if (!wasm.enabled)
        throw new Error(
          "Wasm config isn't loaded or Wasm feature is disabled."
        );

      const clearAdminFee = fabricateFee(wasm.clearAdminGas);

      const messages = toEncodeObject([
        new MsgClearAdmin(address, contractAddress),
      ]);

      return clearAdminTx({
        address,
        messages,
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
              queryKey: [CELATONE_QUERY_KEYS.CONTRACT_DATA],
            }),
          ]);
        },
      });
    },
    [
      address,
      contractAddress,
      fabricateFee,
      getSigningClient,
      queryClient,
      wasm,
    ]
  );
};
