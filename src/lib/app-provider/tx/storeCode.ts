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
  addresses?: BechAddr[];
  codeName: string;
  estimatedFee: Option<StdFee>;
  onTxSucceed: StoreCodeSucceedCallback;
  permission: AccessType;
  wasmCode: Option<Promise<ArrayBuffer>>;
  wasmFileName: Option<string>;
}

export const useStoreCodeTx = (isMigrate: boolean) => {
  const { address } = useCurrentChain();
  const signAndBroadcast = useSignAndBroadcast();

  return useCallback(
    async ({
      addresses,
      codeName,
      estimatedFee,
      onTxSucceed,
      permission,
      wasmCode,
      wasmFileName,
    }: StoreCodeStreamParams) => {
      if (!address) throw new Error("No address provided (useStoreCodeTx)");
      if (!wasmFileName || !wasmCode || !estimatedFee) return null;

      const message = composeStoreCodeMsg({
        addresses,
        permission,
        sender: address,
        wasmByteCode: new Uint8Array(
          await gzip(new Uint8Array(await wasmCode))
        ),
      });

      return storeCodeTx({
        address,
        codeName,
        fee: estimatedFee,
        isMigrate,
        messages: [message],
        onTxSucceed: (txResult) => {
          trackTxSucceed();
          onTxSucceed(txResult);
        },
        signAndBroadcast,
        wasmFileName,
      });
    },
    [address, signAndBroadcast, isMigrate]
  );
};
