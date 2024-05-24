import axios from "axios";

import type {
  AccountModulesResponse,
  DecodeModuleReturn,
  ModuleTableCountsResponse,
  ModuleVerificationInternal,
} from "lib/services/types";
import {
  zAccountModulesResponse,
  zModuleDataResponse,
  zModuleHistoriesResponse,
  zModuleRelatedProposalsResponse,
  zModulesResponse,
  zModuleTableCountsResponse,
  zModuleTxsResponse,
  zModuleVerificationInternal,
} from "lib/services/types";
import type {
  AbiFormData,
  Addr,
  ExposedFunction,
  HexAddr,
  ModuleAbi,
  ModuleData,
  Nullable,
} from "lib/types";
import {
  libDecode,
  parseJsonABI,
  parseWithError,
  serializeAbiData,
} from "lib/utils";

export const getModulesByAddress = async (
  endpoint: string,
  address: Addr
): Promise<AccountModulesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/move/modules`)
    .then(({ data }) => parseWithError(zAccountModulesResponse, data));

export const getModuleVerificationStatus = async (
  endpoint: string,
  address: Addr,
  moduleName: string
): Promise<Nullable<ModuleVerificationInternal>> =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(address)}/${encodeURIComponent(moduleName)}`
    )
    .then(({ data }) => parseWithError(zModuleVerificationInternal, data))
    .catch(() => null);

export const getFunctionView = async (
  baseEndpoint: string,
  address: HexAddr,
  moduleName: string,
  fn: ExposedFunction,
  abiData: AbiFormData
): Promise<string> => {
  const { data } = await axios.post(
    `${baseEndpoint}/initia/move/v1/accounts/${address}/modules/${moduleName}/view_functions/${fn.name}`,
    serializeAbiData(fn, abiData)
  );
  return data.data;
};

export const decodeModule = async (
  decodeAPI: string,
  moduleEncode: string
): Promise<ModuleAbi> =>
  axios
    .post<DecodeModuleReturn>(decodeAPI, {
      code_bytes: moduleEncode,
    })
    .then(({ data }) => parseJsonABI<ModuleAbi>(libDecode(data.abi)));

export const decodeScript = async (
  decodeAPI: string,
  scriptBytes: string
): Promise<ExposedFunction> =>
  axios
    .post<DecodeModuleReturn>(decodeAPI, {
      code_bytes: scriptBytes,
    })
    .then(({ data }) => parseJsonABI<ExposedFunction>(libDecode(data.abi)));

export const getModules = async (
  endpoint: string,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zModulesResponse, data));

export const getModuleData = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  isGov: boolean
): Promise<ModuleData> =>
  axios
    .get(`${endpoint}/${encodeURI(vmAddress)}/${encodeURI(moduleName)}/info`, {
      params: {
        is_gov: isGov,
      },
    })
    .then(({ data }) => parseWithError(zModuleDataResponse, data));

export const getModuleTableCounts = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  isGov: boolean
): Promise<ModuleTableCountsResponse> =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(vmAddress)}/${encodeURIComponent(moduleName)}/table-counts`,
      {
        params: {
          is_gov: isGov,
        },
      }
    )
    .then(({ data }) => parseWithError(zModuleTableCountsResponse, data));

export const getModuleTxs = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  limit: number,
  offset: number,
  isInitia: boolean
) =>
  axios
    .get(
      `${endpoint}/modules/${encodeURIComponent(vmAddress)}/${encodeURIComponent(moduleName)}/txs`,
      {
        params: {
          limit,
          offset,
          is_initia: isInitia,
        },
      }
    )
    .then(({ data }) => parseWithError(zModuleTxsResponse, data));

export const getModuleHistories = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/modules/${encodeURIComponent(vmAddress)}/${encodeURIComponent(moduleName)}/histories`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) => parseWithError(zModuleHistoriesResponse, data));

export const getModuleRelatedProposals = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/modules/${encodeURIComponent(vmAddress)}/${encodeURIComponent(moduleName)}/related-proposals`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) => parseWithError(zModuleRelatedProposalsResponse, data));
