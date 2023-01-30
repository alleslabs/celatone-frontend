import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { uploadContractTx } from "lib/app-fns/tx/upload";
import type { Option } from "lib/types";

export interface UploadStreamParams {
  wasmFileName: Option<string>;
  wasmCode: Option<Promise<ArrayBuffer>>;
  codeDesc: string;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: (codeId: number) => void;
}

export const useUploadContractTx = (isMigrate: boolean) => {
  const { address, getCosmWasmClient } = useWallet();

  return useCallback(
    async ({
      wasmFileName,
      wasmCode,
      codeDesc,
      estimatedFee,
      onTxSucceed,
    }: UploadStreamParams) => {
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
        isMigrate,
      });
    },
    [address, getCosmWasmClient, isMigrate]
  );
};
