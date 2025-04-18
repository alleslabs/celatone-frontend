import type {
  HexAddr20,
  Option,
  EvmContractVerifyForm,
  EvmVerifyConfig,
} from "lib/types";

import { zHexAddr20, EvmProgrammingLanguage } from "lib/types";
import { getLicenseTypeLabel } from "lib/utils";

const CONSTRUCTOR_ARGS_DEFAULT_VALUE = {
  enabled: false,
  value: "",
};

const OPTIMIZER_CONFIG_DEFAULT_VALUE = {
  enabled: false,
  runs: "200",
};

const EVM_VERSION_DEFAULT_VALUE = "default";

const CONTRACT_LIBRARIES_DEFAULT_VALUE = {
  enabled: false,
  value: [
    {
      address: zHexAddr20.parse(""),
      name: "",
    },
  ],
};

export const getEvmContractVerifyFormDefaultValue = (
  contractAddressQueryParam: Option<HexAddr20>
): EvmContractVerifyForm => ({
  compilerVersion: "",
  contractAddress: contractAddressQueryParam ?? zHexAddr20.parse(""),
  language: undefined,
  licenseType: undefined,
  option: undefined,
  verifyForm: {
    solidityContractCode: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      contractCode: "",
      contractLibraries: CONTRACT_LIBRARIES_DEFAULT_VALUE,
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
      optimizerConfig: OPTIMIZER_CONFIG_DEFAULT_VALUE,
    },
    solidityJsonInput: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
    },
    solidityUploadFiles: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      contractLibraries: CONTRACT_LIBRARIES_DEFAULT_VALUE,
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
      files: [],
      optimizerConfig: OPTIMIZER_CONFIG_DEFAULT_VALUE,
    },
    vyperContractCode: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      contractCode: "",
      contractName: "",
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
    },
    vyperJsonInput: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
    },
    vyperUploadFile: {
      constructorArgs: CONSTRUCTOR_ARGS_DEFAULT_VALUE,
      evmVersion: EVM_VERSION_DEFAULT_VALUE,
    },
  },
});

export const formatEvmOptions = (values: string[]) =>
  values.map((value, index) => ({
    label: value === "default" ? `default (${values[index + 1]})` : value,
    value,
  }));

export const getLicenseTypeOptions = (evmVerifyConfig: EvmVerifyConfig) =>
  evmVerifyConfig.licenseType.map((license, index) => ({
    label: `${index + 1}. ${getLicenseTypeLabel(license)}`,
    value: license,
  }));

export const PROGRAMMING_LANGUAGE_OPTIONS = [
  {
    label: "Solidity",
    value: EvmProgrammingLanguage.Solidity,
  },
  {
    label: "Vyper",
    value: EvmProgrammingLanguage.Vyper,
  },
];
