import { zHexAddr20 } from "lib/types";
import { EvmContractVerifyForm } from "./types";
import { isHex20Bytes } from "lib/utils";

const CONSTRUCTOR_ARGS_DEFAULT_VALUE = {
  enabled: false,
  value: "",
};

const OPTIMIZER_CONFIG_DEFAULT_VALUE = {
  enabled: false,
  runs: 200,
};

const EVM_VERSION_DEFAULT_VALUE = "default";

const CONTRACT_LIBRARIES_DEFAULT_VALUE = {
  enabled: false,
  value: [
    {
      name: "",
      address: zHexAddr20.parse(""),
    },
  ],
};

export const getEvmContractVerifyFormDefaultValue = (
  contractAddressQueryParam: string
): EvmContractVerifyForm => ({
  contractAddress: isHex20Bytes(contractAddressQueryParam)
    ? zHexAddr20.parse(contractAddressQueryParam)
    : zHexAddr20.parse(""),
  compilerVersion: "",
  licenseType: "",
  language: "",
  option: "",
  verifyForm: {
    solidityUploadFiles: {
      files: [],
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      optimizerConfig: OPTIMIZER_CONFIG_DEFAULT_VALUE,
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
      contractLibraries: CONTRACT_LIBRARIES_DEFAULT_VALUE,
    },
    solidityContractCode: {
      contractCode: "",
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
      optimizerConfig: OPTIMIZER_CONFIG_DEFAULT_VALUE,
      contractLibraries: CONTRACT_LIBRARIES_DEFAULT_VALUE,
    },
    solidityJsonInput: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
    },
    vyperUploadFile: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
    },
    vyperContractCode: {
      contractName: "",
      contractCode: "",
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
    },
    vyperJsonInput: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
    },
  },
});
