import { JsonFragment } from "ethers";
import {
  EvmContractVerifyForm,
  EvmVerifyOptions,
} from "lib/pages/evm-contract-verify/types";
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

const zEvmVerifyInfoLibraries = z
  .record(z.string(), z.record(z.string(), z.string()))
  .default({})
  .transform((libraries) =>
    Object.entries(libraries).flatMap(([path, libs]) =>
      Object.entries(libs).map(([name, address]) => ({
        contractName: name,
        contractAddress: address,
        contractPath: path,
      }))
    )
  );
export type EvmVerifyInfoLibraries = z.infer<typeof zEvmVerifyInfoLibraries>;

const zEvmOptimizer = z.object({
  enabled: z.boolean(),
  runs: z.number(),
});

// MARK - EvmVerifyInfo
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
    optimizer: z.string().optional(),
    constructor_arguments: z.string(),
    abi: z.string().optional(),
    bytecode_type: z.string(),
    verified_timestamp: zUtcDate.optional(),
    submitted_timestamp: zUtcDate,
    error_message: z.string().optional(),
    settings: z.string().default("{}"),
    source_files: z.array(zEvmVerifyInfoSourceFile),
  })
  .transform(({ abi, optimizer, ...rest }) => ({
    ...snakeToCamel(rest),
    abi: abi ? (JSON.parse(abi) as JsonFragment[]) : [],
    optimizer: optimizer
      ? zEvmOptimizer.parse(JSON.parse(optimizer))
      : undefined,
    isVerified: !!rest.verified_timestamp,
    libraries: zEvmVerifyInfoLibraries.parse(
      JSON.parse(rest.settings).libraries
    ),
  }));
export type EvmVerifyInfo = z.infer<typeof zEvmVerifyInfo>;

// MARK - SubmitEvmVerify
type SubmitEvmVerifyBaseArgs = {
  verifierUrl: string;
  contractAddress: string;
  chainId: string;
  compilerVersion: string;
  licenseType: EvmVerifyLicenseType;
};

export type SubmitEvmVerifyFlattenArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["solidityContractCode"];

export interface SubmitEvmVerifyArgs
  extends Omit<SubmitEvmVerifyBaseArgs, "verifierUrl"> {
  option: EvmVerifyOptions;
  verifyForm: EvmContractVerifyForm["verifyForm"];
}
