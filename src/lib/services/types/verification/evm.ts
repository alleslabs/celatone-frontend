import { JsonFragment } from "ethers";
import { zHexAddr20, zUtcDate } from "lib/types";
import { snakeToCamel } from "lib/utils";
import { z } from "zod";

export enum EvmProgrammingLanguage {
  Solidity = "Solidity",
  Vyper = "Vyper",
}

export enum EvmVerifyLicenseType {
  None = "none",
  Unlicense = "unlicense",
  MIT = "mit",
  GNUGPLv2 = "gnu_gpl_v2",
  GNUGPLv3 = "gnu_gpl_v3",
  GNULGPLv2_1 = "gnu_lgpl_v2_1",
  GNULGPLv3 = "gnu_lgpl_v3",
  BSD2Clause = "bsd_2_clause",
  BSD3Clause = "bsd_3_clause",
  MPL2_0 = "mpl_2_0",
  OSL3_0 = "osl_3_0",
  Apache2_0 = "apache_2_0",
  GNUAGPLv3 = "gnu_agpl_v3",
  BSL1_1 = "bsl_1_1",
}

export const zEvmVerifyConfig = z
  .object({
    license_type: z.array(z.nativeEnum(EvmVerifyLicenseType)),
    solidity_compiler_versions: z.array(z.string()),
    solidity_evm_versions: z.array(z.string()),
    vyper_compiler_versions: z.array(z.string()),
    vyper_evm_versions: z.array(z.string()),
  })
  .transform(snakeToCamel);
export type EvmVerifyConfig = z.infer<typeof zEvmVerifyConfig>;

const zEvmVerifyInfoSourceFile = z
  .object({
    source_path: z.string(),
    evm_source_file: z.object({
      hash: z.string(),
      content: z.string(),
    }),
  })
  .transform(snakeToCamel);
export type EvmVerifyInfoSourceFile = z.infer<typeof zEvmVerifyInfoSourceFile>;

const zEvmOptimizer = z.object({
  enabled: z.boolean(),
  runs: z.number(),
});

export const zEvmVerifyInfo = z
  .object({
    guid: z.string().uuid(),
    license: z.nativeEnum(EvmVerifyLicenseType),
    language: z.nativeEnum(EvmProgrammingLanguage),
    chain_id: z.string(),
    address: zHexAddr20,
    contract_name: z.string().optional(),
    contract_path: z.string().optional(),
    compiler_version: z.string(),
    evm_version: z.string(),
    optimizer: z.string(),
    constructor_arguments: z.string(),
    abi: z.string().optional(),
    bytecode_type: z.string(),
    verified_timestamp: zUtcDate.optional(),
    submitted_timestamp: zUtcDate,
    error_message: z.string().optional(),
    // libraries: z.array() // TODO: Recheck
    settings: z.string(),
    source_files: z.array(zEvmVerifyInfoSourceFile),
  })
  .transform(({ abi, optimizer, ...rest }) => ({
    ...snakeToCamel(rest),
    abi: abi ? (JSON.parse(abi) as JsonFragment[]) : [],
    optimizer: zEvmOptimizer.parse(JSON.parse(optimizer)),
    isVerified: !!rest.verified_timestamp,
  }));
export type EvmVerifyInfo = z.infer<typeof zEvmVerifyInfo>;
