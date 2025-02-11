import {
  EvmContractVerifyForm,
  EvmVerifyLicenseType,
  EvmVerifyOptions,
} from "lib/types";

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

// MARK - Vyper Contract Code
export type SubmitEvmVerifyVyperContractCodeArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["vyperContractCode"];

export interface SubmitEvmVerifyArgs
  extends Omit<SubmitEvmVerifyBaseArgs, "verifierUrl"> {
  option: EvmVerifyOptions;
  verifyForm: EvmContractVerifyForm["verifyForm"];
}
