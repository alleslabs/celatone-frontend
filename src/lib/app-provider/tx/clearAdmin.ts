import type { BechAddr32 } from "lib/types";

import { MsgClearAdmin } from "@initia/initia.js";
import { useQueryClient } from "@tanstack/react-query";
import { trackTxSucceed } from "lib/amplitude";
import { clearAdminTx } from "lib/app-fns/tx/clearAdmin";
import { toEncodeObject } from "lib/utils";
import { useCallback } from "react";

import { CELATONE_QUERY_KEYS } from "../env";
import {
  useCurrentChain,
  useFabricateFee,
  useSignAndBroadcast,
  useWasmConfig,
} from "../hooks";

export interface ClearAdminStreamParams {
  onTxSucceed?: () => void;
}

export const useClearAdminTx = (contractAddress: BechAddr32) => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();
  const queryClient = useQueryClient();
  const fabricateFee = useFabricateFee();
  const wasm = useWasmConfig({ shouldRedirect: false });

  return useCallback(
    async ({ onTxSucceed }: ClearAdminStreamParams) => {
      if (!address) throw new Error("No address provided (useClearAdminTx)");

      if (!wasm.enabled)
        throw new Error("Wasm config is not enabled (useClearAdminTx)");

      const clearAdminFee = fabricateFee(wasm.clearAdminGas);

      const messages = toEncodeObject([
        new MsgClearAdmin(address, contractAddress),
      ]);

      return clearAdminTx({
        address,
        fee: clearAdminFee,
        messages,
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
        signAndBroadcast,
      });
    },
    [
      address,
      contractAddress,
      fabricateFee,
      queryClient,
      signAndBroadcast,
      wasm,
    ]
  );
};
