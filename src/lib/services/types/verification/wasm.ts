import { z } from "zod";

import { zRelatedWasmVerifyInfo, zWasmVerifyInfo } from "lib/types";

export interface WasmVerifyRequest {
  chainId: string;
  codeId: number;
  commit: string;
  compilerVersion: string;
  gitUrl: string;
  packageName: string;
}

export const zWasmVerifyInfosResponse = z.record(
  z.coerce.number(),
  zWasmVerifyInfo.nullable()
);
export type WasmVerifyInfosResponse = z.infer<typeof zWasmVerifyInfosResponse>;

export const zWasmRelatedVerifyInfosResponse = z.record(
  z.string(),
  zRelatedWasmVerifyInfo
);
