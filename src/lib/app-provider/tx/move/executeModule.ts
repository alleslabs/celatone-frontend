import type { StdFee } from "@cosmjs/stargate";
import { MsgExecute as MsgExecuteModule } from "@initia/initia.js";
import { useCallback } from "react";

import { executeModuleTx } from "lib/app-fns/tx/move/executeModule";
import { useCurrentChain } from "lib/app-provider/hooks";
import type { HexAddr, HumanAddr } from "lib/types";
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
  const { address, getSigningCosmWasmClient } = useCurrentChain();
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
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");

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
        address: address as HumanAddr,
        messages,
        fee: estimatedFee,
        client,
        onTxSucceed,
        onTxFailed,
      });
    },
    [address, getSigningCosmWasmClient]
  );
};
