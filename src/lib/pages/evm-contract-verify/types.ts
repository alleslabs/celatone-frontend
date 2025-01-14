import { zHexAddr20 } from "lib/types";
import { z } from "zod";

export enum EvmProgrammingLanguage {
  Solidity = "solidity",
  Vyper = "vyper",
}

export enum VerificationOptions {
  UploadFile = "upload-file",
  UploadFiles = "upload-files",
  ContractCode = "contract-code",
  JsonInput = "json-input",
  Hardhat = "hardhat",
  Foundry = "foundry",
}

// MARK - Query Params
export const zEvmContractVerifyQueryParams = z.object({
  contractAddress: zHexAddr20,
});

// MARK - Solidity
const zEvmContractVerifySolidityOptionUploadFilesForm = z.object({
  option: z.literal(VerificationOptions.UploadFiles),
  constructorArgs: z.string().optional(),
  evmVersion: z.string(),
});

const zEvmContractVerifySolidityOptionContractCodeForm = z.object({
  option: z.literal(VerificationOptions.ContractCode),
  constructorArgs: z.string().optional(),
});

const zEvmContractVerifySolidityOptionJsonInputForm = z.object({
  option: z.literal(VerificationOptions.JsonInput),
  constructorArgs: z.string().optional(),
});

const zEvmContractVerifySolidityOptionHardhatForm = z.object({
  option: z.literal(VerificationOptions.Hardhat),
});

const zEvmContractVerifySolidityOptionFoundryForm = z.object({
  option: z.literal(VerificationOptions.Foundry),
});

// MARK - Vyper
const zEvmContractVerifyVyperOptionUploadFileForm = z.object({
  option: z.literal(VerificationOptions.UploadFile),
  constructorArgs: z.string().optional(),
});

const zEvmContractVerifyVyperOptionContractCodeForm = z.object({
  option: z.literal(VerificationOptions.ContractCode),
  constructorArgs: z.string().optional(),
});

const zEvmContractVerifyVyperOptionJsonInputForm = z.object({
  option: z.literal(VerificationOptions.JsonInput),
  constructorArgs: z.string().optional(),
});

// MARK - Union of options by language
const zEvmContractVerifySolidityOptionForm = z.discriminatedUnion("option", [
  zEvmContractVerifySolidityOptionUploadFilesForm,
  zEvmContractVerifySolidityOptionContractCodeForm,
  zEvmContractVerifySolidityOptionJsonInputForm,
  zEvmContractVerifySolidityOptionHardhatForm,
  zEvmContractVerifySolidityOptionFoundryForm,
]);

const zEvmContractVerifyVyperOptionForm = z.discriminatedUnion("option", [
  zEvmContractVerifyVyperOptionUploadFileForm,
  zEvmContractVerifyVyperOptionContractCodeForm,
  zEvmContractVerifyVyperOptionJsonInputForm,
]);

const zEvmContractAddressAndLicenseForm = z.object({
  contractAddress: zHexAddr20,
  compilerVersion: z.string().refine((val) => val !== ""),
  licenseType: z.string().refine((val) => val !== ""),
});

export const zEvmContractVerifyForm = zEvmContractAddressAndLicenseForm.merge(
  z.object({
    verifyForm: z
      .union([
        z.object({
          language: z.literal(EvmProgrammingLanguage.Solidity),
          form: zEvmContractVerifySolidityOptionForm,
        }),
        z.object({
          language: z.literal(EvmProgrammingLanguage.Vyper),
          form: zEvmContractVerifyVyperOptionForm,
        }),
      ])
      .optional(),
  })
);
export type EvmContractVerifyForm = z.infer<typeof zEvmContractVerifyForm>;
