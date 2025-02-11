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

export type SubmitEvmVerifyFlattenArgs = SubmitEvmVerifyBaseArgs &
  EvmContractVerifyForm["verifyForm"]["solidityContractCode"];

export interface SubmitEvmVerifyArgs
  extends Omit<SubmitEvmVerifyBaseArgs, "verifierUrl"> {
  option: EvmVerifyOptions;
  verifyForm: EvmContractVerifyForm["verifyForm"];
}
