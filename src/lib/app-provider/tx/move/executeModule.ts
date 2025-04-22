import type { StdFee } from "@cosmjs/stargate";
import type { HexAddr } from "lib/types";

import { MsgExecute as MsgExecuteModule } from "@initia/initia.js";
import { trackTxSucceed } from "lib/amplitude";
import { executeModuleTx } from "lib/app-fns/tx/move/executeModule";
import { useCurrentChain, useSignAndBroadcast } from "lib/app-provider/hooks";
import { toEncodeObject } from "lib/utils";
import { useCallback } from "react";

export interface ExecuteModuleStreamParams {
  args: string[];
  estimatedFee?: StdFee;
  functionName: string;
  moduleAddress: HexAddr;
  moduleName: string;
  onTxFailed?: () => void;
  onTxSucceed?: () => void;
  typeArgs: string[];
}

export const useExecuteModuleTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      args,
      estimatedFee,
      functionName,
      moduleAddress,
      moduleName,
      onTxFailed,
      onTxSucceed,
      typeArgs,
    }: ExecuteModuleStreamParams) => {
      if (!address) throw new Error("No address provided (useExecuteModuleTx)");

      const messages = toEncodeObject([
        new MsgExecuteModule(
          address,
          moduleAddress,
          moduleName,
          functionName,
          typeArgs,
          args
        ),
      ]);

      if (!estimatedFee) return null;
      return executeModuleTx({
        address,
        fee: estimatedFee,
        messages,
        onTxFailed,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        signAndBroadcast,
      });
    },
    [address, signAndBroadcast]
  );
};
