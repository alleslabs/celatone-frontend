import type { JsonFragment } from "ethers";

import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { isHex20Bytes } from "lib/utils/validate";
import { z, ZodIssueCode } from "zod";

import type { HexAddr20 } from "./addrs";
import type { Option } from "./common";

import { zHexAddr20 } from "./addrs";
import { zUtcDate } from "./time";

export enum EvmMethodId {
  CallErc20Factory = "0x06ef1a86",
  Transfer = "0x",
  TransferErc20 = "0xa9059cbb",
}

export enum EvmMethodName {
  CallErc20Factory = "Call ERC20 Factory",
  Create = "Create",
  Transfer = "Transfer",
  TransferErc20 = "Transfer ERC20",
}

export type EvmToAddress =
  | {
      address: HexAddr20;
      evmTxHash: Option<string>;
      toType: EvmMethodName.Create;
    }
  | {
      address: HexAddr20;
      toType: EvmMethodName.CallErc20Factory;
    }
  | {
      address: HexAddr20;
      toType: null;
    };

// MARK: Verification
export enum EvmProgrammingLanguage {
  Solidity = "Solidity",
  Vyper = "Vyper",
}

export enum EvmVerifyLicenseType {
  Apache2_0 = "apache_2_0",
  BSD2Clause = "bsd_2_clause",
  BSD3Clause = "bsd_3_clause",
  BSL1_1 = "bsl_1_1",
  GNUAGPLv3 = "gnu_agpl_v3",
  GNUGPLv2 = "gnu_gpl_v2",
  GNUGPLv3 = "gnu_gpl_v3",
  GNULGPLv2_1 = "gnu_lgpl_v2_1",
  GNULGPLv3 = "gnu_lgpl_v3",
  MIT = "mit",
  MPL2_0 = "mpl_2_0",
  None = "none",
  OSL3_0 = "osl_3_0",
  Unlicense = "unlicense",
}

export enum EvmVerifyOptions {
  SolidityContractCode = "solidity-contract-code",
  SolidityFoundry = "solidity-foundry",
  SolidityHardhat = "solidity-hardhat",
  SolidityJsonInput = "solidity-json-input",
  SolidityUploadFiles = "solidity-upload-files",
  VyperContractCode = "vyper-contract-code",
  VyperJsonInput = "vyper-json-input",
  VyperUploadFile = "vyper-upload-file",
}

// MARK - Shared Components
const zEvmOptimizerConfig = z
  .object({
    enabled: z.boolean(),
    runs: z.string(),
  })
  .refine(({ enabled, runs }) => !enabled || runs !== "");

const zConstructorArgs = z
  .object({
    enabled: z.boolean(),
    value: z.string(),
  })
  .refine(({ enabled, value }) => !enabled || value !== "");

const zEvmTargetVersion = z.string().refine((val) => val !== "");

const zContractLibrary = z.object({
  address: zHexAddr20,
  name: z.string(),
});

const zContractLibraries = z
  .object({
    enabled: z.boolean(),
    value: z.array(zContractLibrary),
  })
  .refine(
    ({ enabled, value }) =>
      !enabled ||
      value.every((item) => item.name !== "" && isHex20Bytes(item.address))
  );
export type ContractLibraries = z.infer<typeof zContractLibraries>;

const zFile = z
  .instanceof(File)
  .optional()
  .superRefine((file, ctx) => {
    if (file === undefined)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File is required",
      });
  });

// MARK - Solidity
export const zEvmContractVerifySolidityOptionUploadFilesForm = z.object({
  constructorArgs: zConstructorArgs,
  contractLibraries: zContractLibraries,
  evmVersion: zEvmTargetVersion,
  files: z
    .array(
      z.object({
        file: z.instanceof(File),
      })
    )
    .refine((val) => val.length > 0),
  optimizerConfig: zEvmOptimizerConfig,
});

export const zEvmContractVerifySolidityOptionContractCodeForm = z.object({
  constructorArgs: zConstructorArgs,
  contractCode: z.string(),
  contractLibraries: zContractLibraries,
  evmVersion: zEvmTargetVersion,
  optimizerConfig: zEvmOptimizerConfig,
});

export const zEvmContractVerifySolidityOptionJsonInputForm = z.object({
  constructorArgs: zConstructorArgs,
  jsonFile: zFile,
});

// MARK - Vyper
export const zEvmContractVerifyVyperOptionUploadFileForm = z.object({
  constructorArgs: zConstructorArgs,
  evmVersion: zEvmTargetVersion,
  file: zFile,
});

export const zEvmContractVerifyVyperOptionContractCodeForm = z.object({
  constructorArgs: zConstructorArgs,
  contractCode: z.string().refine((val) => val !== ""),
  contractName: z.string().refine((val) => val !== ""),
  evmVersion: zEvmTargetVersion,
});

export const zEvmContractVerifyVyperOptionJsonInputForm = z.object({
  constructorArgs: zConstructorArgs,
  jsonFile: zFile,
});

// MARK - Base for all verify forms
export const zEvmContractVerifyBase = z.object({
  compilerVersion: z.string(),
  // TODO: refactor later
  contractAddress: zHexAddr20.superRefine((val, ctx) => {
    if (val === "")
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
      });

    if (!isHex20Bytes(val))
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Invalid address",
      });
  }),
  language: z.nativeEnum(EvmProgrammingLanguage).optional(),
  licenseType: z.nativeEnum(EvmVerifyLicenseType).optional(),
  option: z.nativeEnum(EvmVerifyOptions).optional(),
});

// MARK - EvmContractVerifyForm
export const zEvmContractVerifyForm = zEvmContractVerifyBase.merge(
  z.object({
    verifyForm: z.object({
      solidityContractCode: zEvmContractVerifySolidityOptionContractCodeForm,
      solidityJsonInput: zEvmContractVerifySolidityOptionJsonInputForm,
      solidityUploadFiles: zEvmContractVerifySolidityOptionUploadFilesForm,
      vyperContractCode: zEvmContractVerifyVyperOptionContractCodeForm,
      vyperJsonInput: zEvmContractVerifyVyperOptionJsonInputForm,
      vyperUploadFile: zEvmContractVerifyVyperOptionUploadFileForm,
    }),
  })
);
export type EvmContractVerifyForm = z.infer<typeof zEvmContractVerifyForm>;

// MARK - EvmVerifyConfig
export const zEvmVerifyConfig = z
  .object({
    license_type: z.array(z.nativeEnum(EvmVerifyLicenseType)),
    solidity_compiler_versions: z.array(z.string()),
    solidity_evm_versions: z
      .array(z.string())
      .transform((val) => val.reverse()),
    vyper_compiler_versions: z.array(z.string()),
    vyper_evm_versions: z.array(z.string()).transform((val) => val.reverse()),
  })
  .transform(snakeToCamel);
export type EvmVerifyConfig = z.infer<typeof zEvmVerifyConfig>;

// MARK - For EvmVerifyInfo
const zEvmVerifyInfoSourceFile = z
  .object({
    evm_source_file: z.object({
      content: z.string(),
      hash: z.string(),
    }),
    source_path: z.string(),
  })
  .transform(snakeToCamel);
export type EvmVerifyInfoSourceFile = z.infer<typeof zEvmVerifyInfoSourceFile>;

const zEvmVerifyInfoLibraries = z
  .record(z.string(), z.record(z.string(), z.string()))
  .default({})
  .transform((libraries) =>
    Object.entries(libraries).flatMap(([path, libs]) =>
      Object.entries(libs).map(([name, address]) => ({
        contractAddress: address,
        contractName: name,
        contractPath: path,
      }))
    )
  );
export type EvmVerifyInfoLibraries = z.infer<typeof zEvmVerifyInfoLibraries>;

const zEvmOptimizer = z.string().transform((value, ctx) => {
  try {
    const parsed = JSON.parse(value);
    return z
      .object({
        enabled: z.boolean(),
        runs: z.number(),
      })
      .parse(parsed);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid JSON format for optimizer object.",
    });
    return z.NEVER;
  }
});

// possible values: "none", "codesize", "gas" (default: "gas")
const zVyperOptimizer = z.enum(["none", "codesize", "gas"]);

const zOptimizer = z.union([zEvmOptimizer, zVyperOptimizer]).optional();

const zCompiledResults = z.array(
  z.record(z.string(), z.object({ creation: z.string(), deployed: z.string() }))
);

const zEvmVerifyError = z
  .preprocess(
    (val) => JSON.parse(String(val)),
    z.object({
      code: z.string(),
      details: z.union([
        z.preprocess(
          (val) => JSON.parse(String(val)),
          z.object({
            compiled_results: zCompiledResults,
            required_bytecode: z.string(),
          })
        ),
        z.string(),
      ]),
      message: z.string(),
    })
  )
  .transform(snakeToCamel);
export type EvmVerifyError = z.infer<typeof zEvmVerifyError>;

// MARK - EvmVerifyInfo
export const zEvmVerifyInfo = z
  .object({
    abi: z.string().optional(),
    address: zHexAddr20,
    bytecode_type: z.string(),
    chain_id: z.string(),
    compiler_version: z.string(),
    constructor_arguments: z.string(),
    contract_name: z.string().optional(),
    contract_path: z.string().optional(),
    error_message: zEvmVerifyError.optional(),
    evm_version: z.string(),
    guid: z.string().uuid(),
    language: z.nativeEnum(EvmProgrammingLanguage),
    license: z.nativeEnum(EvmVerifyLicenseType),
    optimizer: zOptimizer,
    settings: z.string().default("{}"),
    source_files: z.array(zEvmVerifyInfoSourceFile),
    submitted_timestamp: zUtcDate,
    verified_timestamp: zUtcDate.optional(),
  })
  .transform(({ abi, ...rest }) => ({
    ...snakeToCamel(rest),
    abi: abi ? (JSON.parse(abi) as JsonFragment[]) : [],
    error: rest.error_message,
    isVerified: !!rest.verified_timestamp,
    libraries: zEvmVerifyInfoLibraries.parse(
      JSON.parse(rest.settings).libraries
    ),
  }));
export type EvmVerifyInfo = z.infer<typeof zEvmVerifyInfo>;
