import type {
  SubmitEvmVerifyArgs,
  SubmitEvmVerifySolidityContractCodeArgs,
  SubmitEvmVerifySolidityJsonInputArgs,
  SubmitEvmVerifySolidityUploadFilesArgs,
  SubmitEvmVerifyVyperContractCodeArgs,
  SubmitEvmVerifyVyperJsonInputArgs,
  SubmitEvmVerifyVyperUploadFilesArgs,
} from "lib/services/types";
import type { HexAddr20 } from "lib/types";

import axios from "axios";
import { CELATONE_VERIFICATION_API } from "env";
import { zEvmVerifyInfosResponse } from "lib/services/types";
import { EvmVerifyOptions, zEvmVerifyConfig } from "lib/types";

import {
  BYTECODE_TYPE,
  formatContractLibraries,
  getVerifierUrl,
} from "./utils";

export const getEvmVerifyConfig = async () =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/evm/verification/config`)
    .then(({ data }) => zEvmVerifyConfig.parse(data));

export const getEvmVerifyInfos = async (
  chainId: string,
  contractAddresses: HexAddr20[]
) =>
  axios
    .get(`${CELATONE_VERIFICATION_API}/evm/verification/infos`, {
      params: {
        addresses: contractAddresses.join(","),
        chain_id: chainId,
      },
    })
    .then(({ data }) => zEvmVerifyInfosResponse.parse(data));

// === EVM Contract Verification Submission ===
// Handles HTTP POST requests for different verification options.
// Prepares data for Solidity & Vyper verification.
// ============================================

// ============== Solidity ==============
const submitEvmVerifySolidityContractCode = async ({
  chainId,
  compilerVersion,
  constructorArgs,
  contractAddress,
  contractCode,
  contractLibraries,
  evmVersion,
  licenseType,
  optimizerConfig,
  verifierUrl,
}: SubmitEvmVerifySolidityContractCodeArgs) => {
  const settings = {
    evmVersion,
    libraries: formatContractLibraries(contractLibraries),
    optimizer: {
      enabled: optimizerConfig.enabled,
      runs: Number(optimizerConfig.runs),
    },
  };

  return axios.post(
    verifierUrl,
    {
      bytecode_type: BYTECODE_TYPE,
      compiler_version: compilerVersion,
      constructor_arguments: constructorArgs.enabled
        ? constructorArgs.value
        : undefined,
      license: licenseType,
      metadata: {
        chain_id: chainId,
        contract_address: contractAddress,
      },
      settings: JSON.stringify(settings),
      source_code: contractCode,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const submitEvmVerifySolidityUploadFiles = async ({
  chainId,
  compilerVersion,
  constructorArgs,
  contractAddress,
  contractLibraries,
  evmVersion,
  files,
  licenseType,
  optimizerConfig,
  verifierUrl,
}: SubmitEvmVerifySolidityUploadFilesArgs) => {
  if (files.length === 0)
    throw new Error(
      "At least one file is required (submitEvmVerifySolidityUploadFiles)"
    );

  const formData = new FormData();

  formData.append("license", licenseType);
  formData.append("language", "Solidity");
  formData.append("bytecode_type", BYTECODE_TYPE);
  formData.append("compiler_version", compilerVersion);
  if (constructorArgs.enabled) {
    formData.append("constructor_arguments", constructorArgs.value);
  }
  formData.append(
    "metadata",
    JSON.stringify({
      chain_id: chainId,
      contract_address: contractAddress,
    })
  );
  formData.append(
    "settings",
    JSON.stringify({
      evmVersion,
      libraries: formatContractLibraries(contractLibraries),
      optimizer: {
        enabled: optimizerConfig.enabled,
        runs: Number(optimizerConfig.runs),
      },
    })
  );

  files.forEach((file) => {
    formData.append("files", file.file);
  });

  return axios.post(verifierUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ============== Vyper ==============
const submitEvmVerifyVyperContractCode = async ({
  chainId,
  compilerVersion,
  constructorArgs,
  contractAddress,
  contractCode,
  contractName,
  evmVersion,
  licenseType,
  verifierUrl,
}: SubmitEvmVerifyVyperContractCodeArgs) =>
  axios.post(
    verifierUrl,
    {
      bytecode_type: BYTECODE_TYPE,
      compiler_version: compilerVersion,
      constructor_arguments: constructorArgs.enabled
        ? constructorArgs.value
        : undefined,
      contract_name: contractName,
      license: licenseType,
      metadata: {
        chain_id: chainId,
        contract_address: contractAddress,
      },
      settings: JSON.stringify({
        evmVersion,
      }),
      source_code: contractCode,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

const submitEvmVerifyVyperUploadFiles = async ({
  chainId,
  compilerVersion,
  constructorArgs,
  contractAddress,
  evmVersion,
  file,
  licenseType,
  verifierUrl,
}: SubmitEvmVerifyVyperUploadFilesArgs) => {
  if (!file)
    throw new Error("File is required (submitEvmVerifyVyperUploadFiles)");

  const formData = new FormData();

  formData.append("license", licenseType);
  formData.append("language", "Vyper");
  formData.append("bytecode_type", BYTECODE_TYPE);
  formData.append("compiler_version", compilerVersion);
  if (constructorArgs.enabled) {
    formData.append("constructor_arguments", constructorArgs.value);
  }
  formData.append(
    "metadata",
    JSON.stringify({
      chain_id: chainId,
      contract_address: contractAddress,
    })
  );
  formData.append(
    "settings",
    JSON.stringify({
      evmVersion,
    })
  );
  formData.append("files", file);

  return axios.post(verifierUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ============= JSON Input For Both ==============
const submitEvmVerifyJsonInput = async ({
  chainId,
  compilerVersion,
  constructorArgs,
  contractAddress,
  jsonFile,
  licenseType,
  verifierUrl,
}:
  | SubmitEvmVerifySolidityJsonInputArgs
  | SubmitEvmVerifyVyperJsonInputArgs) => {
  if (!jsonFile)
    throw new Error("JSON file is required (submitEvmVerifyJsonInput)");
  const reader = new FileReader();
  const jsonContent = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(jsonFile);
  });
  return axios.post(
    verifierUrl,
    {
      bytecode_type: BYTECODE_TYPE,
      compiler_version: compilerVersion,
      constructor_arguments: constructorArgs.enabled
        ? constructorArgs.value
        : undefined,
      input: jsonContent,
      license: licenseType,
      metadata: {
        chain_id: chainId,
        contract_address: contractAddress,
      },
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
    case EvmVerifyOptions.SolidityJsonInput:
      return submitEvmVerifyJsonInput({
        verifierUrl,
        ...rest,
        ...verifyForm.solidityJsonInput,
      });
    case EvmVerifyOptions.SolidityUploadFiles:
      return submitEvmVerifySolidityUploadFiles({
        verifierUrl,
        ...rest,
        ...verifyForm.solidityUploadFiles,
      });
    case EvmVerifyOptions.VyperJsonInput:
      return submitEvmVerifyJsonInput({
        verifierUrl,
        ...rest,
        ...verifyForm.vyperJsonInput,
      });
    case EvmVerifyOptions.VyperContractCode:
      return submitEvmVerifyVyperContractCode({
        verifierUrl,
        ...rest,
        ...verifyForm.vyperContractCode,
      });
    case EvmVerifyOptions.VyperUploadFile:
      return submitEvmVerifyVyperUploadFiles({
        verifierUrl,
        ...rest,
        ...verifyForm.vyperUploadFile,
      });
    default:
      throw new Error(`Unsupported option: ${option}`);
  }
};
