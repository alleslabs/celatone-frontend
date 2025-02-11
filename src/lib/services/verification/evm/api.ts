import axios from "axios";
import { CELATONE_VERIFICATION_API } from "env";
import {
  EvmVerifyOptions,
  SubmitEvmVerifyArgs,
  SubmitEvmVerifySolidityContractCodeArgs,
  SubmitEvmVerifyVyperContractCodeArgs,
  zEvmVerifyConfig,
  zEvmVerifyInfo,
} from "lib/services/types";
import { HexAddr20 } from "lib/types";
import { BYTECODE_TYPE, getVerifierUrl } from "./utils";
import { isHex20Bytes } from "lib/utils";

export const getEvmVerifyConfig = async () =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/evm/verification/config`)
    .then(({ data }) => zEvmVerifyConfig.parse(data));

export const getEvmVerifyInfo = async (
  chainId: string,
  contractAddress: HexAddr20
) =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/evm/verification/info`, {
      params: {
        chain_id: chainId,
        address: contractAddress,
      },
    })
    .then(({ data }) => zEvmVerifyInfo.parse(data));

// === EVM Contract Verification Submission ===
// Handles HTTP POST requests for different verification options.
// Prepares data for Solidity & Vyper verification.
// ============================================

const submitEvmVerifySolidityContractCode = async ({
  verifierUrl,
  contractAddress,
  chainId,
  compilerVersion,
  licenseType,
  contractCode,
  optimizerConfig,
  constructorArgs,
  evmVersion,
  contractLibraries,
}: SubmitEvmVerifySolidityContractCodeArgs) => {
  const settings = {
    evmVersion,
    optimizer: {
      enabled: optimizerConfig.enabled,
      runs: Number(optimizerConfig.runs),
    },
    libraries: contractLibraries.value.reduce((acc, library) => {
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
    }, {}),
  };

  return axios.post(
    verifierUrl,
    {
      license: licenseType,
      bytecode_type: BYTECODE_TYPE,
      compiler_version: compilerVersion,
      constructor_arguments: constructorArgs.value,
      metadata: {
        chain_id: chainId,
        contract_address: contractAddress,
      },
      source_code: contractCode,
      settings: JSON.stringify(settings),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const submitEvmVerifyVyperContractCode = async ({
  verifierUrl,
  contractAddress,
  chainId,
  compilerVersion,
  licenseType,
  contractCode,
  evmVersion,
  contractName,
  constructorArgs,
}: SubmitEvmVerifyVyperContractCodeArgs) => {
  const settings = {
    evmVersion: evmVersion === "default" ? "cancun" : evmVersion,
  };

  return axios.post(
    verifierUrl,
    {
      license: licenseType,
      bytecode_type: BYTECODE_TYPE,
      contract_name: contractName,
      compiler_version: compilerVersion,
      constructor_arguments: constructorArgs.value,
      metadata: {
        chain_id: chainId,
        contract_address: contractAddress,
      },
      source_code: contractCode,
      settings: JSON.stringify(settings),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const submitEvmVerify = async ({
  option,
  verifyForm,
  ...rest
}: SubmitEvmVerifyArgs) => {
  const verifierUrl = getVerifierUrl(option);

  switch (option) {
    case EvmVerifyOptions.SolidityContractCode:
      return submitEvmVerifySolidityContractCode({
        verifierUrl,
        ...rest,
        ...verifyForm.solidityContractCode,
      });
    case EvmVerifyOptions.VyperContractCode:
      return submitEvmVerifyVyperContractCode({
        verifierUrl,
        ...rest,
        ...verifyForm.vyperContractCode,
      });
    // TODO: Implement other options
    default:
      throw new Error(`Unsupported option: ${option}`);
  }
};
