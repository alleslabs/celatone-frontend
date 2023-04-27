import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { uploadContractTx } from "lib/app-fns/tx/upload";
import type { AccessType, Addr, HumanAddr, Option } from "lib/types";
import { composeStoreCodeMsg } from "lib/utils";

export interface UploadStreamParams {
  wasmFileName: Option<string>;
  wasmCode: Option<Promise<ArrayBuffer>>;
  addresses: Addr[];
  permission: AccessType;
  codeName: string;
  estimatedFee: Option<StdFee>;
  onTxSucceed?: (codeId: number) => void;
}

export const useUploadContractTx = (isMigrate: boolean) => {
  const { address, getCosmWasmClient } = useWallet();

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
      const client = await getCosmWasmClient();
      if (!address || !client)
        throw new Error("Please check your wallet connection.");
      if (!wasmFileName || !wasmCode || !estimatedFee) return null;

      const message = composeStoreCodeMsg({
        sender: address as Addr,
        wasmByteCode: new Uint8Array(await wasmCode),
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
        onTxSucceed,
        isMigrate,
      });
    },
    [address, getCosmWasmClient, isMigrate]
  );
};
