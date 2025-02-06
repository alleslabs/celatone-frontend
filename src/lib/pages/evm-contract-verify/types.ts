import {
  EvmProgrammingLanguage,
  EvmVerifyLicenseType,
} from "lib/services/types";
import { zHexAddr20 } from "lib/types";
import { isHex20Bytes } from "lib/utils";
import { z, ZodIssueCode } from "zod";

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

// MARK - Query Params
export const zEvmContractVerifyQueryParams = z.object({
  contractAddress: z.preprocess((val) => {
    const address = String(val).trim();
    return isHex20Bytes(address) ? address : undefined;
  }, zHexAddr20.optional()),
});

// MARK - Shared Components
const zOptimizerConfig = z.object({
  enabled: z.boolean(),
  runs: z.string(),
});
export type OptimizerConfig = z.infer<typeof zOptimizerConfig>;

const zConstructorArgs = z.object({
  enabled: z.boolean(),
  value: z.string(),
});

const zEvmTargetVersion = z.string();

const zContractLibrary = z.object({
  name: z.string(),
  address: zHexAddr20,
});

const zContractLibraries = z.object({
  enabled: z.boolean(),
  value: z.array(zContractLibrary),
});

// MARK - Solidity
const zEvmContractVerifySolidityOptionUploadFilesForm = z.object({
  files: z.array(
    z.object({
      file: z.instanceof(File),
    })
  ),
  constructorArgs: zConstructorArgs,
  optimizerConfig: zOptimizerConfig,
  evmVersion: zEvmTargetVersion,
  contractLibraries: zContractLibraries,
});

const zEvmContractVerifySolidityOptionContractCodeForm = z.object({
  contractCode: z.string(),
  constructorArgs: zConstructorArgs,
  evmVersion: zEvmTargetVersion,
  optimizerConfig: zOptimizerConfig,
  contractLibraries: zContractLibraries,
});

const zEvmContractVerifySolidityOptionJsonInputForm = z.object({
  jsonFile: z.instanceof(File).optional(),
  constructorArgs: zConstructorArgs,
});

// MARK - Vyper
const zEvmContractVerifyVyperOptionUploadFileForm = z.object({
  file: z.instanceof(File).optional(),
  constructorArgs: zConstructorArgs,
  evmVersion: zEvmTargetVersion,
});

const zEvmContractVerifyVyperOptionContractCodeForm = z.object({
  contractName: z.string(),
  contractCode: z.string(),
  constructorArgs: zConstructorArgs,
  evmVersion: zEvmTargetVersion,
});

const zEvmContractVerifyVyperOptionJsonInputForm = z.object({
  jsonFile: z.instanceof(File).optional(),
  constructorArgs: zConstructorArgs,
});

// MARK - Base
const zEvmContractVerifyBase = z.object({
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
  compilerVersion: z.string(),
  licenseType: z.nativeEnum(EvmVerifyLicenseType).optional(),
  language: z.nativeEnum(EvmProgrammingLanguage).optional(),
  option: z.nativeEnum(EvmVerifyOptions).optional(),
});

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
