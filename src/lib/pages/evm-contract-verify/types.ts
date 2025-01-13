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
export const zEvmContractVerifySolidityOptionUploadFilesForm = z.object({
  option: z.literal(VerificationOptions.UploadFiles),
});

export const zEvmContractVerifySolidityOptionContractCodeForm = z.object({
  option: z.literal(VerificationOptions.ContractCode),
});

export const zEvmContractVerifySolidityOptionJsonInputForm = z.object({
  option: z.literal(VerificationOptions.JsonInput),
});

export const zEvmContractVerifySolidityOptionHardhatForm = z.object({
  option: z.literal(VerificationOptions.Hardhat),
});

export const zEvmContractVerifySolidityOptionFoundryForm = z.object({
  option: z.literal(VerificationOptions.Foundry),
});

// MARK - Vyper
export const zEvmContractVerifyVyperOptionUploadFileForm = z.object({
  option: z.literal(VerificationOptions.UploadFile),
  file: z.instanceof(File),
  // .refine((file) => ["application/vy"].includes(file.type), {
  //   message: "Invalid file type",
  // }),
});

export const zEvmContractVerifyVyperOptionContractCodeForm = z.object({
  option: z.literal(VerificationOptions.ContractCode),
});

export const zEvmContractVerifyVyperOptionJsonInputForm = z.object({
  option: z.literal(VerificationOptions.JsonInput),
});

// MARK - Union of all options
export const zEvmContractVerifyOptionForm = z.union([
  zEvmContractVerifyVyperOptionUploadFileForm,
  zEvmContractVerifyVyperOptionContractCodeForm,
  zEvmContractVerifyVyperOptionJsonInputForm,
  zEvmContractVerifySolidityOptionUploadFilesForm,
  zEvmContractVerifySolidityOptionContractCodeForm,
  zEvmContractVerifySolidityOptionJsonInputForm,
  zEvmContractVerifySolidityOptionHardhatForm,
  zEvmContractVerifySolidityOptionFoundryForm,
]);

export const zEvmContractAddressAndLicenseForm = z.object({
  contractAddress: zHexAddr20,
  licenseType: z.string().refine((val) => val !== ""),
  language: z.nativeEnum(EvmProgrammingLanguage),
  compilerVersion: z.string().refine((val) => val !== ""),
});

export const zEvmContractVerifyForm = zEvmContractAddressAndLicenseForm.merge(
  z.object({
    verifyForm: zEvmContractVerifyOptionForm,
  })
);
export type EvmContractVerifyForm = z.infer<typeof zEvmContractVerifyForm>;
