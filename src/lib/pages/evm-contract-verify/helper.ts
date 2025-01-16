import { EvmProgrammingLanguage, VerificationOptions } from "./types";

export const getVerifyFormInitialValue = (
  language: EvmProgrammingLanguage,
  verificationOption: VerificationOptions
) => {
  const constructorArgs = {
    enabled: false,
    value: "",
  };

  const optimizerConfig = {
    enabled: false,
    runs: 200,
  };

  if (language === EvmProgrammingLanguage.Solidity) {
    switch (verificationOption) {
      case VerificationOptions.UploadFiles:
        return {
          option: verificationOption,
          constructorArgs,
          optimizerConfig,
          evmVersion: "default",
        };
      case VerificationOptions.ContractCode:
        return {
          option: verificationOption,
          constructorArgs,
          optimizerConfig,
        };
      case VerificationOptions.JsonInput:
        return {
          option: verificationOption,
          constructorArgs,
        };
      default:
        throw new Error("Invalid verification option for Solidity");
    }
  } else if (language === EvmProgrammingLanguage.Vyper) {
    switch (verificationOption) {
      case VerificationOptions.UploadFile:
        return {
          option: verificationOption,
          file: undefined,
          constructorArgs,
          evmVersion: "default",
        };
      case VerificationOptions.ContractCode:
        return {
          option: verificationOption,
          constructorArgs,
        };
      case VerificationOptions.JsonInput:
        return {
          option: verificationOption,
          constructorArgs,
        };
      default:
        throw new Error("Invalid verification option for Vyper");
    }
  }

  throw new Error("Invalid language (getVerifyFormInitialValue)");
};
