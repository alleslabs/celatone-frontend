import { z } from "zod";

import { zUtcDate } from "lib/types";

export enum VerificationStatus {
  NOT_VERIFIED,
  IN_PROGRESS,
  VERIFIED,
  INDIRECTLY_VERIFIED,
  FAILED,
}

export interface WasmVerifyRequest {
  chainId: string;
  codeId: number;
  gitUrl: string;
  commit: string;
  packageName: string;
  compilerVersion: string;
}

const zWasmVerifyInfo = z.object({
  verificationInfo: z.object({
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
  }),
  schema: z.any(),
  relatedVerifiedCodes: z.number().array(),
});
export type WasmVerifyInfo = z.infer<typeof zWasmVerifyInfo>;

export const zWasmVerifyInfosResponse = z.record(
  z.coerce.number(),
  zWasmVerifyInfo.nullable()
);
