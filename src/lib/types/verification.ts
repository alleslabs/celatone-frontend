import type { RJSFSchema as JsonSchema } from "@rjsf/utils";

import { z } from "zod";

import type { Nullable, Option } from "./common";
import type { JsonDataType } from "./json";

import { zUtcDate } from "./time";

// ------------------------------------------//
// ------------------SCHEMA------------------//
// ------------------------------------------//

export enum SchemaProperties {
  CONTRACT_NAME = "contract_name",
  CONTRACT_VERSION = "contract_version",
  IDL_VERSION = "idl_version",
  INSTANTIATE = "instantiate",
  EXECUTE = "execute",
  QUERY = "query",
  MIGRATE = "migrate",
  SUDO = "sudo",
  RESPONSES = "responses",
  ATTACHED_CODE_ID = "attached_code_id",
}

export interface SchemaInfo {
  title: Option<string>;
  description: Option<string>;
  schema: JsonSchema;
  inputRequired?: boolean;
}

export interface CodeSchema {
  [SchemaProperties.CONTRACT_NAME]: string;
  [SchemaProperties.CONTRACT_VERSION]: string;
  [SchemaProperties.IDL_VERSION]: string;
  [SchemaProperties.INSTANTIATE]: JsonSchema;
  [SchemaProperties.EXECUTE]: Nullable<JsonSchema>;
  [SchemaProperties.QUERY]: Nullable<JsonSchema>;
  [SchemaProperties.MIGRATE]: Nullable<JsonSchema>;
  [SchemaProperties.SUDO]: Nullable<JsonSchema>;
  [SchemaProperties.RESPONSES]: { [key: string]: JsonSchema };
  [SchemaProperties.ATTACHED_CODE_ID]: string;
}

export type QuerySchema = Array<[SchemaInfo, SchemaInfo]>;
export type ExecuteSchema = Array<SchemaInfo>;

export interface QueryResponse {
  data: JsonDataType;
}

// ------------------------------------------//
// ---------------VERIFICATION---------------//
// ------------------------------------------//

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
  commit: z.string(),
  comparedTimestamp: zUtcDate.nullable(),
  compiledTimestamp: zUtcDate.nullable(),
  compilerVersion: z.string(),
  downloadedTimestamp: zUtcDate.nullable(),
  errorMessage: z.string().nullable(),
  gitUrl: z.string(),
  packageName: z.string(),
  submittedTimestamp: zUtcDate,
});
export type WasmVerifyInfoBase = z.infer<typeof zWasmVerifyInfoBase>;

export const zWasmVerifyInfo = z
  .object({
    relatedVerifiedCodes: z.number().array(),
    schema: z.unknown().nullable(),
    verificationInfo: zWasmVerifyInfoBase.nullable(),
  })
  .transform(({ relatedVerifiedCodes, schema, verificationInfo }) => ({
    relatedVerifiedCodes,
    schema: schema !== null ? (schema as CodeSchema) : null,
    verificationInfo,
  }));
export type WasmVerifyInfo = z.infer<typeof zWasmVerifyInfo>;

export const zRelatedWasmVerifyInfo = z
  .object({
    relatedVerifiedCodes: z.number().array(),
    schema: z.unknown().nullable(),
  })
  .transform(({ relatedVerifiedCodes, schema }) => ({
    relatedVerifiedCodes,
    schema: schema !== null ? (schema as CodeSchema) : null,
  }));
