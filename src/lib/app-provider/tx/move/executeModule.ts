import type { StdFee } from "@cosmjs/stargate";
import { MsgExecute as MsgExecuteModule } from "@initia/initia.js";
import { useCallback } from "react";

import { trackTxSucceed } from "lib/amplitude";
import { executeModuleTx } from "lib/app-fns/tx/move/executeModule";
import { useCurrentChain, useSignAndBroadcast } from "lib/app-provider/hooks";
import type { HexAddr } from "lib/types";
import { toEncodeObject } from "lib/utils";

export interface ExecuteModuleStreamParams {
  moduleAddress: HexAddr;
  moduleName: string;
  functionName: string;
  typeArgs: string[];
  args: string[];
  estimatedFee?: StdFee;
  onTxSucceed?: () => void;
  onTxFailed?: () => void;
}

export const useExecuteModuleTx = () => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      moduleAddress,
      moduleName,
      functionName,
      typeArgs,
      args,
      estimatedFee,
      onTxSucceed,
      onTxFailed,
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
        messages,
        fee: estimatedFee,
        signAndBroadcast,
        onTxSucceed: () => {
          trackTxSucceed();
          onTxSucceed?.();
        },
        onTxFailed,
      });
    },
    [address, signAndBroadcast]
  );
};
