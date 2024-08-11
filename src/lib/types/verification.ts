import { z } from "zod";

import { zUtcDate } from "./time";

export enum WasmVerifyStatus {
  NOT_VERIFIED,
  IN_PROGRESS,
  VERIFIED,
  INDIRECTLY_VERIFIED,
  FAILED,
}

const zWasmVerifyInfoBase = z.object({
  chainId: z.string(),
  codeId: z.number(),
  gitUrl: z.string(),
  commit: z.string(),
  packageName: z.string(),
  compilerVersion: z.string(),
  submittedTimestamp: zUtcDate,
  downloadedTimestamp: zUtcDate.nullable(),
  compiledTimestamp: zUtcDate.nullable(),
  comparedTimestamp: zUtcDate.nullable(),
  errorMessage: z.string().nullable(),
});
export type WasmVerifyInfoBase = z.infer<typeof zWasmVerifyInfoBase>;

export const zWasmVerifyInfo = z.object({
  verificationInfo: zWasmVerifyInfoBase.nullable(),
  schema: z.unknown().nullable(),
  relatedVerifiedCodes: z.number().array(),
});
export type WasmVerifyInfo = z.infer<typeof zWasmVerifyInfo>;
