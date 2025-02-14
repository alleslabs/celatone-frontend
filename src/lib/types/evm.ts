import { JsonFragment } from "ethers";
import { z, ZodIssueCode } from "zod";
import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { isHex20Bytes } from "lib/utils/validate";
import { zHexAddr20 } from "./addrs";
import { zUtcDate } from "./time";

export enum EvmMethodId {
  Transfer = "0x",
  TransferErc20 = "0xa9059cbb",
  Create = "0x60806040",
  CallErc20Factory = "0x06ef1a86",
}

export enum EvmMethodName {
  Transfer = "Transfer",
  TransferErc20 = "Transfer ERC20",
  Create = "Create",
  CallErc20Factory = "Call ERC20 Factory",
}

// MARK: Verification
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

export enum EvmVerifyOptions {
  VyperUploadFile = "vyper-upload-file",
  VyperContractCode = "vyper-contract-code",
  VyperJsonInput = "vyper-json-input",
  SolidityUploadFiles = "solidity-upload-files",
  SolidityContractCode = "solidity-contract-code",
  SolidityJsonInput = "solidity-json-input",
  SolidityHardhat = "solidity-hardhat",
  SolidityFoundry = "solidity-foundry",
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
  name: z.string(),
  address: zHexAddr20,
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
  files: z
    .array(
      z.object({
        file: z.instanceof(File),
      })
    )
    .refine((val) => val.length > 0),
  constructorArgs: zConstructorArgs,
  optimizerConfig: zEvmOptimizerConfig,
  evmVersion: zEvmTargetVersion,
  contractLibraries: zContractLibraries,
});

export const zEvmContractVerifySolidityOptionContractCodeForm = z.object({
  contractCode: z.string(),
  constructorArgs: zConstructorArgs,
  evmVersion: zEvmTargetVersion,
  optimizerConfig: zEvmOptimizerConfig,
  contractLibraries: zContractLibraries,
});

export const zEvmContractVerifySolidityOptionJsonInputForm = z.object({
  jsonFile: zFile,
  constructorArgs: zConstructorArgs,
});

// MARK - Vyper
export const zEvmContractVerifyVyperOptionUploadFileForm = z.object({
  file: zFile,
  constructorArgs: zConstructorArgs,
  evmVersion: zEvmTargetVersion,
});

export const zEvmContractVerifyVyperOptionContractCodeForm = z.object({
  contractName: z.string().refine((val) => val !== ""),
  contractCode: z.string().refine((val) => val !== ""),
  constructorArgs: zConstructorArgs,
  evmVersion: zEvmTargetVersion,
});

export const zEvmContractVerifyVyperOptionJsonInputForm = z.object({
  jsonFile: zFile,
  constructorArgs: zConstructorArgs,
});

// MARK - Base for all verify forms
export const zEvmContractVerifyBase = z.object({
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
  licenseType: z.nativeEnum(EvmVerifyLicenseType).optional(),
  language: z.nativeEnum(EvmProgrammingLanguage).optional(),
  compilerVersion: z.string(),
  option: z.nativeEnum(EvmVerifyOptions).optional(),
});

// MARK - EvmContractVerifyForm
export const zEvmContractVerifyForm = zEvmContractVerifyBase.merge(
  z.object({
    verifyForm: z.object({
      solidityUploadFiles: zEvmContractVerifySolidityOptionUploadFilesForm,
      solidityContractCode: zEvmContractVerifySolidityOptionContractCodeForm,
      solidityJsonInput: zEvmContractVerifySolidityOptionJsonInputForm,
      vyperUploadFile: zEvmContractVerifyVyperOptionUploadFileForm,
      vyperContractCode: zEvmContractVerifyVyperOptionContractCodeForm,
      vyperJsonInput: zEvmContractVerifyVyperOptionJsonInputForm,
    }),
  })
);
export type EvmContractVerifyForm = z.infer<typeof zEvmContractVerifyForm>;

// MARK - EvmVerifyConfig
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

// MARK - For EvmVerifyInfo
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
    optimizer: zOptimizer,
    constructor_arguments: z.string(),
    abi: z.string().optional(),
    bytecode_type: z.string(),
    verified_timestamp: zUtcDate.optional(),
    submitted_timestamp: zUtcDate,
    error_message: z.string().optional(),
    settings: z.string().default("{}"),
    source_files: z.array(zEvmVerifyInfoSourceFile),
  })
  .transform(({ abi, ...rest }) => ({
    ...snakeToCamel(rest),
    abi: abi ? (JSON.parse(abi) as JsonFragment[]) : [],
    isVerified: !!rest.verified_timestamp,
    libraries: zEvmVerifyInfoLibraries.parse(
      JSON.parse(rest.settings).libraries
    ),
  }));
export type EvmVerifyInfo = z.infer<typeof zEvmVerifyInfo>;
