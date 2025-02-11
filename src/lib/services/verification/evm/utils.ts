import { CELATONE_VERIFICATION_API } from "env";
import { EvmVerifyOptions } from "lib/services/types";

export const getVerifierUrl = (option: EvmVerifyOptions) => {
  const baseUrl = `${CELATONE_VERIFICATION_API}/evm/verification`;
  switch (option) {
    case EvmVerifyOptions.SolidityUploadFiles:
      return `${baseUrl}/solidity/multi-part`;
    case EvmVerifyOptions.SolidityContractCode:
      return `${baseUrl}/solidity/flatten`;
    case EvmVerifyOptions.SolidityJsonInput:
      return `${baseUrl}/solidity/standard-json`;
    case EvmVerifyOptions.VyperUploadFile:
      return `${baseUrl}/vyper/multi-part`;
    case EvmVerifyOptions.VyperContractCode:
      return `${baseUrl}/vyper/flatten`;
    case EvmVerifyOptions.VyperJsonInput:
      return `${baseUrl}/vyper/standard-json`;
    default:
      throw new Error("Unsupported option (getVerifierUrl)");
  }
};

export const BYTECODE_TYPE = "CREATION_INPUT";
