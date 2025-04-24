import type { RJSFSchema as JsonSchema } from "@rjsf/utils";

import { z } from "zod";

import type { Nullable, Option } from "./common";
import type { JsonDataType } from "./json";

import { zUtcDate } from "./time";

// ------------------------------------------//
// ------------------SCHEMA------------------//
// ------------------------------------------//

export enum SchemaProperties {
  ATTACHED_CODE_ID = "attached_code_id",
  CONTRACT_NAME = "contract_name",
  CONTRACT_VERSION = "contract_version",
  EXECUTE = "execute",
  IDL_VERSION = "idl_version",
  INSTANTIATE = "instantiate",
  MIGRATE = "migrate",
  QUERY = "query",
  RESPONSES = "responses",
  SUDO = "sudo",
}

export interface SchemaInfo {
  description: Option<string>;
  inputRequired?: boolean;
  schema: JsonSchema;
  title: Option<string>;
}

export interface CodeSchema {
  [SchemaProperties.ATTACHED_CODE_ID]: string;
  [SchemaProperties.CONTRACT_NAME]: string;
  [SchemaProperties.CONTRACT_VERSION]: string;
  [SchemaProperties.EXECUTE]: Nullable<JsonSchema>;
  [SchemaProperties.IDL_VERSION]: string;
  [SchemaProperties.INSTANTIATE]: JsonSchema;
  [SchemaProperties.MIGRATE]: Nullable<JsonSchema>;
  [SchemaProperties.QUERY]: Nullable<JsonSchema>;
  [SchemaProperties.RESPONSES]: { [key: string]: JsonSchema };
  [SchemaProperties.SUDO]: Nullable<JsonSchema>;
}

export type ExecuteSchema = Array<SchemaInfo>;
export type QuerySchema = Array<[SchemaInfo, SchemaInfo]>;

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
