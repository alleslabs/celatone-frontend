import { CELATONE_VERIFICATION_API } from "env";
import { EvmVerifyOptions } from "lib/types";

export const getVerifierUrl = (option: EvmVerifyOptions) => {
  const baseUrl = `${CELATONE_VERIFICATION_API}/evm/verification`;
  switch (option) {
    case EvmVerifyOptions.SolidityUploadFiles:
      return `${baseUrl}/solidity/multi`;
    case EvmVerifyOptions.SolidityContractCode:
      return `${baseUrl}/solidity/flatten`;
    case EvmVerifyOptions.SolidityJsonInput:
      return `${baseUrl}/solidity/standard-json`;
    case EvmVerifyOptions.VyperUploadFile:
      return `${baseUrl}/vyper/upload-file`;
    case EvmVerifyOptions.VyperContractCode:
      return `${baseUrl}/vyper/contract-code`;
    case EvmVerifyOptions.VyperJsonInput:
      return `${baseUrl}/vyper/json-input`;
    default:
      throw new Error("Unsupported option (getVerifierUrl)");
  }
};
