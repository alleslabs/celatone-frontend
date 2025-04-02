import type {
  EvmContractVerifyForm,
  EvmVerifyLicenseType,
  EvmVerifyOptions,
} from "lib/types";

import { zEvmVerifyInfo } from "lib/types";
import { z } from "zod";

// MARK - SubmitEvmVerify
type SubmitEvmVerifyBaseArgs = {
  verifierUrl: string;
  contractAddress: string;
  chainId: string;
  compilerVersion: string;
  licenseType: EvmVerifyLicenseType;
};

// MARK - Solidity Contract Code
export type SubmitEvmVerifySolidityContractCodeArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["solidityContractCode"];

// MARK - Solidity Json Input
export type SubmitEvmVerifySolidityJsonInputArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["solidityJsonInput"];

// MARK - Solidity Upload Files
export type SubmitEvmVerifySolidityUploadFilesArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["solidityUploadFiles"];

// MARK - Vyper Contract Code
export type SubmitEvmVerifyVyperContractCodeArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["vyperContractCode"];

// MARK - Vyper Json Input
export type SubmitEvmVerifyVyperJsonInputArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["vyperJsonInput"];

// MARK - Vyper Upload File
export type SubmitEvmVerifyVyperUploadFilesArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["vyperUploadFile"];

export interface SubmitEvmVerifyArgs
  extends Omit<SubmitEvmVerifyBaseArgs, "verifierUrl"> {
  option: EvmVerifyOptions;
  verifyForm: EvmContractVerifyForm["verifyForm"];
}

export const zEvmVerifyInfosResponse = z.record(
  z.string(),
  zEvmVerifyInfo.nullable()
);
export type EvmVerifyInfosResponse = z.infer<typeof zEvmVerifyInfosResponse>;
