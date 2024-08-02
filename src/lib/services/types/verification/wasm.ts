import { z } from "zod";

import { zWasmVerifyInfo } from "lib/types";

export interface WasmVerifyRequest {
  chainId: string;
  codeId: number;
  gitUrl: string;
  commit: string;
  packageName: string;
  compilerVersion: string;
}

export const zWasmVerifyInfosResponse = z.record(
  z.coerce.number(),
  zWasmVerifyInfo.nullable()
);
