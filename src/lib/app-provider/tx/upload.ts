import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { uploadContractTx } from "lib/app-fns/tx/upload";

export interface UploadStreamParams {
  onTxSucceed?: (codeId: number) => void;
  codeDesc: string;
}

export const useUploadContractTx = (
  wasmFileName: string | undefined,
  wasmCode: Promise<ArrayBuffer> | undefined,
  estimatedFee: StdFee | undefined
) => {
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({ onTxSucceed, codeDesc }: UploadStreamParams) => {
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!wasmFileName || !wasmCode || !estimatedFee) return null;

      return uploadContractTx({
        address,
        wasmCode: new Uint8Array(await wasmCode),
        codeDesc,
        wasmFileName,
        fee: estimatedFee,
        client,
        onTxSucceed,
      });
    },
    [address, getCosmWasmClient, estimatedFee, wasmCode, wasmFileName]
  );
};
