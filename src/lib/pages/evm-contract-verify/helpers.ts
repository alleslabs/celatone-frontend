import { HexAddr20, Option, zHexAddr20 } from "lib/types";
import { EvmContractVerifyForm, EvmProgrammingLanguage } from "./types";
import { EvmVerifyConfig, EVMVerifyLicenseType } from "lib/services/types";

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
  contractAddressQueryParam: Option<HexAddr20>
): EvmContractVerifyForm => ({
  contractAddress: contractAddressQueryParam ?? zHexAddr20.parse(""),
  compilerVersion: "",
  licenseType: "",
  language: undefined,
  option: undefined,
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

const getLicenseTypeLabel = (license: EVMVerifyLicenseType) => {
  switch (license) {
    case EVMVerifyLicenseType.None:
      return "1. No License (None)";
    case EVMVerifyLicenseType.Unlicense:
      return "2. The Unlicense (Unlicense)";
    case EVMVerifyLicenseType.MIT:
      return "3. MIT License (MIT)";
    case EVMVerifyLicenseType.GNUGPLv2:
      return "4. GNU General Public License v2.0 (GNU GPLv2)";
    case EVMVerifyLicenseType.GNUGPLv3:
      return "5. GNU General Public License v3.0 (GNU GPLv3)";
    case EVMVerifyLicenseType.GNULGPLv2_1:
      return "6. GNU Lesser General Public License v2.1 (GNU LGPLv2.1)";
    case EVMVerifyLicenseType.GNULGPLv3:
      return "7. GNU Lesser General Public License v3.0 (GNU LGPLv3)";
    case EVMVerifyLicenseType.BSD2Clause:
      return `8. BSD 2-Clause "Simplified" license (BSD 2-Clause)`;
    case EVMVerifyLicenseType.BSD3Clause:
      return `9. BSD 3-Clause "New" or "Revised" license (BSD 3-Clause)`;
    case EVMVerifyLicenseType.MPL2_0:
      return "10. Mozilla Public License 2.0 (MPL 2.0)";
    case EVMVerifyLicenseType.OSL3_0:
      return "11. Open Software License 3.0 (OSL 3.0)";
    case EVMVerifyLicenseType.Apache2_0:
      return "12. Apache 2.0 (Apache 2.0)";
    case EVMVerifyLicenseType.GNUAGPLv3:
      return "13. GNU Affero General Public License (GNU AGPLv3)";
    case EVMVerifyLicenseType.BSL1_1:
      return "14. Business Source License (BSL 1.1)";
    default:
      return "";
  }
};

export const formatEvmOptions = (values: string[]) =>
  values.map((value) => ({
    label: value,
    value,
  }));

export const getLicenseTypeOptions = (evmVerifyConfig: EvmVerifyConfig) =>
  evmVerifyConfig.licenseType.map((license) => ({
    label: getLicenseTypeLabel(license),
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
