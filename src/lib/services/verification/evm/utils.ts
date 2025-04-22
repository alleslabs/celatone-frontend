import type { ContractLibraries } from "lib/types";

import { CELATONE_VERIFICATION_API } from "env";
import { EvmVerifyOptions } from "lib/types";
import { isHex20Bytes } from "lib/utils/validate";

export const getVerifierUrl = (option: EvmVerifyOptions) => {
  const baseUrl = `${CELATONE_VERIFICATION_API}/evm/verification`;
  switch (option) {
    case EvmVerifyOptions.SolidityContractCode:
      return `${baseUrl}/solidity/flatten`;
    case EvmVerifyOptions.SolidityJsonInput:
      return `${baseUrl}/solidity/standard-json`;
    case EvmVerifyOptions.SolidityUploadFiles:
      return `${baseUrl}/solidity/multi-part`;
    case EvmVerifyOptions.VyperContractCode:
      return `${baseUrl}/vyper/flatten`;
    case EvmVerifyOptions.VyperJsonInput:
      return `${baseUrl}/vyper/standard-json`;
    case EvmVerifyOptions.VyperUploadFile:
      return `${baseUrl}/vyper/multi-part`;
    default:
      throw new Error("Unsupported option (getVerifierUrl)");
  }
};

export const BYTECODE_TYPE = "CREATION_INPUT";

export const formatContractLibraries = (libraries: ContractLibraries) => {
  if (!libraries.enabled || libraries.value.length === 0) return undefined;

  return libraries.value.reduce((acc, library) => {
    if (
      library.name.trim().length === 0 ||
      !isHex20Bytes(library.address.trim())
    )
      return acc;

    Object.assign(acc, {
      [`${library.name}.sol`]: {
        [library.name]: library.address,
      },
    });
    return acc;
  }, {});
};
