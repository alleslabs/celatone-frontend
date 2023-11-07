import type { StdFee } from "@cosmjs/stargate";
import { gzip } from "node-gzip";
import { useCallback } from "react";

import { useCurrentChain } from "../hooks";
import { trackTxSucceed } from "lib/amplitude";
import { uploadContractTx } from "lib/app-fns/tx/upload";
import type { AccessType, Addr, HumanAddr, Option } from "lib/types";
import { composeStoreCodeMsg } from "lib/utils";

export interface UploadTxInternalResult {
  codeDisplayName: string;
  codeId: string;
  codeHash: string;
  txHash: string;
  formattedFee: string;
}

export type UploadSucceedCallback = (txResult: UploadTxInternalResult) => void;

export interface UploadStreamParams {
  wasmFileName: Option<string>;
  wasmCode: Option<Promise<ArrayBuffer>>;
  addresses?: Addr[];
  permission: AccessType;
  codeName: string;
  estimatedFee: Option<StdFee>;
  onTxSucceed: UploadSucceedCallback;
}

export const useUploadContractTx = (isMigrate: boolean) => {
  const { address, getSigningCosmWasmClient } = useCurrentChain();

  return useCallback(
    async ({
      wasmFileName,
      wasmCode,
      addresses,
      permission,
      codeName,
      estimatedFee,
      onTxSucceed,
    }: UploadStreamParams) => {
      const client = await getSigningCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!wasmFileName || !wasmCode || !estimatedFee) return null;

      const message = composeStoreCodeMsg({
        sender: address as Addr,
        wasmByteCode: await gzip(new Uint8Array(await wasmCode)),
        permission,
        addresses,
      });

      return uploadContractTx({
        address: address as HumanAddr,
        messages: [message],
        codeName,
        wasmFileName,
        fee: estimatedFee,
        client,
        isMigrate,
        onTxSucceed: (txResult) => {
          trackTxSucceed();
          onTxSucceed(txResult);
        },
      });
    },
    [address, getSigningCosmWasmClient, isMigrate]
  );
};
