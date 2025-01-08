import type { StdFee } from "@cosmjs/stargate";
import { gzip } from "node-gzip";
import { useCallback } from "react";

import { useCurrentChain, useSignAndBroadcast } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import type { StoreCodeSucceedCallback } from "lib/app-fns/tx/storeCode";
import { storeCodeTx } from "lib/app-fns/tx/storeCode";
import type { AccessType, BechAddr, Option } from "lib/types";
import { composeStoreCodeMsg } from "lib/utils";

export interface StoreCodeStreamParams {
  wasmFileName: Option<string>;
  wasmCode: Option<Promise<ArrayBuffer>>;
  addresses?: BechAddr[];
  permission: AccessType;
  codeName: string;
  estimatedFee: Option<StdFee>;
  onTxSucceed: StoreCodeSucceedCallback;
}

export const useStoreCodeTx = (isMigrate: boolean) => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      wasmFileName,
      wasmCode,
      addresses,
      permission,
      codeName,
      estimatedFee,
      onTxSucceed,
    }: StoreCodeStreamParams) => {
      if (!address) throw new Error("No address provided (useStoreCodeTx)");
      if (!wasmFileName || !wasmCode || !estimatedFee) return null;

      const message = composeStoreCodeMsg({
        sender: address,
        wasmByteCode: new Uint8Array(
          await gzip(new Uint8Array(await wasmCode))
        ),
        permission,
        addresses,
      });

      return storeCodeTx({
        address,
        messages: [message],
        codeName,
        wasmFileName,
        fee: estimatedFee,
        isMigrate,
        signAndBroadcast,
        onTxSucceed: (txResult) => {
          trackTxSucceed();
          onTxSucceed(txResult);
        },
      });
    },
    [address, signAndBroadcast, isMigrate]
  );
};
