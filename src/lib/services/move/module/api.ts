import axios from "axios";

import { INITIA_MOVE_DECODER, INITIA_MOVE_VERIFIER } from "env";
import type {
  DecodeModuleReturn,
  ModuleTableCountsResponse,
  ModuleVerificationInternal,
} from "lib/services/types";
import {
  zModuleHistoriesResponse,
  zModulePublishInfoResponse,
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
  ModulePublishInfo,
  Nullable,
} from "lib/types";
import {
  libDecode,
  parseJsonABI,
  parseWithError,
  serializeAbiData,
} from "lib/utils";

export const getMoveVerifyInfo = async (
  address: Addr,
  moduleName: string
): Promise<Nullable<ModuleVerificationInternal>> =>
  axios
    .get(
      `${INITIA_MOVE_VERIFIER}/${encodeURI(address)}/${encodeURI(moduleName)}`
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

export const decodeModule = async (moduleEncode: string): Promise<ModuleAbi> =>
  axios
    .post<DecodeModuleReturn>(`${INITIA_MOVE_DECODER}/decode_module`, {
      code_bytes: moduleEncode,
    })
    .then(({ data }) => parseJsonABI<ModuleAbi>(libDecode(data.abi)));

export const decodeScript = async (
  endpoint: string,
  scriptBytes: string
): Promise<ExposedFunction> =>
  axios
    .post<DecodeModuleReturn>(endpoint, {
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

export const getModulePublishInfo = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  isGov: boolean
): Promise<ModulePublishInfo> =>
  axios
    .get(
      `${endpoint}/${encodeURI(vmAddress)}/${encodeURI(moduleName)}/publish_info`,
      {
        params: {
          is_gov: isGov,
        },
      }
    )
    .then(({ data }) => parseWithError(zModulePublishInfoResponse, data));

export const getModuleTableCounts = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  isGov: boolean
): Promise<ModuleTableCountsResponse> =>
  axios
    .get(
      `${endpoint}/${encodeURI(vmAddress)}/${encodeURI(moduleName)}/table-counts`,
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
      `${endpoint}/modules/${encodeURI(vmAddress)}/${encodeURI(moduleName)}/txs`,
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
      `${endpoint}/modules/${encodeURI(vmAddress)}/${encodeURI(moduleName)}/histories`,
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
      `${endpoint}/modules/${encodeURI(vmAddress)}/${encodeURI(moduleName)}/related-proposals`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) => parseWithError(zModuleRelatedProposalsResponse, data));
