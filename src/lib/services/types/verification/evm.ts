import type {
  EvmContractVerifyForm,
  EvmVerifyLicenseType,
  EvmVerifyOptions,
} from "lib/types";

import { zEvmVerifyInfo } from "lib/types";
import { z } from "zod";

// MARK - SubmitEvmVerify
type SubmitEvmVerifyBaseArgs = {
  chainId: string;
  compilerVersion: string;
  contractAddress: string;
  licenseType: EvmVerifyLicenseType;
  verifierUrl: string;
};

// MARK - Solidity Contract Code
export type SubmitEvmVerifySolidityContractCodeArgs =
  EvmContractVerifyForm["verifyForm"]["solidityContractCode"] &
    SubmitEvmVerifyBaseArgs;

// MARK - Solidity JSON Input
export type SubmitEvmVerifySolidityJsonInputArgs =
  EvmContractVerifyForm["verifyForm"]["solidityJsonInput"] &
    SubmitEvmVerifyBaseArgs;

// MARK - Solidity Upload Files
export type SubmitEvmVerifySolidityUploadFilesArgs =
  EvmContractVerifyForm["verifyForm"]["solidityUploadFiles"] &
    SubmitEvmVerifyBaseArgs;

// MARK - Vyper Contract Code
export type SubmitEvmVerifyVyperContractCodeArgs =
  EvmContractVerifyForm["verifyForm"]["vyperContractCode"] &
    SubmitEvmVerifyBaseArgs;

// MARK - Vyper JSON Input
export type SubmitEvmVerifyVyperJsonInputArgs =
  EvmContractVerifyForm["verifyForm"]["vyperJsonInput"] &
    SubmitEvmVerifyBaseArgs;

// MARK - Vyper Upload File
export type SubmitEvmVerifyVyperUploadFilesArgs =
  EvmContractVerifyForm["verifyForm"]["vyperUploadFile"] &
    SubmitEvmVerifyBaseArgs;

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
