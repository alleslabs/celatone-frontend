import axios from "axios";
import { CELATONE_VERIFICATION_API } from "env";
import {
  EvmVerifyOptions,
  SubmitEvmVerifyArgs,
  SubmitEvmVerifyFlattenArgs,
  zEvmVerifyConfig,
  zEvmVerifyInfo,
} from "lib/services/types";
import { HexAddr20 } from "lib/types";
import { getVerifierUrl } from "./utils";

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

const submitEvmVerifyFlatten = async ({
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
}: SubmitEvmVerifyFlattenArgs) => {
  const settings = {
    evmVersion: evmVersion === "default" ? "cancun" : evmVersion,
    optimizer: {
      enabled: optimizerConfig.enabled,
      runs: Number(optimizerConfig.runs),
    },
    libraries: contractLibraries.value.reduce(
      (acc, library) => ({
        ...acc,
        [`${library.name}.sol`]: {
          [library.name]: library.address,
        },
      }),
      {}
    ),
    metadata: {
      bytecodeHash: "none",
    },
    outputSelection: {
      "*": {
        "": ["ast"],
        "*": ["abi", "evm.bytecode", "evm.methodIdentifiers", "metadata"],
      },
    },
  };

  return axios.post(
    verifierUrl,
    {
      license: licenseType,
      bytecode_type: "CREATION_INPUT",
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
      return submitEvmVerifyFlatten({
        verifierUrl,
        ...rest,
        ...verifyForm.solidityContractCode,
      });
    // TODO: Implement other options
    default:
      throw new Error(`Unsupported option: ${option}`);
  }
};
