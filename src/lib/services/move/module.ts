import axios from "axios";
import { z } from "zod";

import { zProposal, zProposalsResponseItem } from "../proposal";
import { zTxsResponseItem } from "../types";
import type {
  AbiFormData,
  Addr,
  ExposedFunction,
  HexAddr,
  IndexedModule,
  ModuleAbi,
  ModuleData,
  ModuleInfo,
  Nullable,
} from "lib/types";
import {
  UpgradePolicy,
  zHexAddr,
  zPagination,
  zRemark,
  zUtcDate,
} from "lib/types";
import {
  indexModuleAbi,
  libDecode,
  parseJsonABI,
  parseTxHash,
  parseWithError,
  serializeAbiData,
  snakeToCamel,
} from "lib/utils";

const zBaseModuleLcd = z.object({
  address: zHexAddr,
  module_name: z.string(),
  abi: z.string(),
  raw_bytes: z.string(),
  upgrade_policy: z.nativeEnum(UpgradePolicy),
});

const zIndexedModuleLcd = zBaseModuleLcd.transform<IndexedModule>((val) => ({
  ...snakeToCamel(val),
  ...indexModuleAbi(val.abi),
}));

const zModuleLcdReturn = z.object({
  module: zIndexedModuleLcd,
});

export const getModuleByAddressLcd = async (
  baseEndpoint: string,
  address: Addr,
  moduleName: string
): Promise<IndexedModule> =>
  axios
    .get(
      `${baseEndpoint}/initia/move/v1/accounts/${encodeURIComponent(address)}/modules/${encodeURIComponent(moduleName)}`
    )
    .then(({ data }) => parseWithError(zModuleLcdReturn, data).module);

const zModulesLcdReturn = z.object({
  modules: z.array(zIndexedModuleLcd),
  pagination: zPagination,
});

export const getModulesByAddressLcd = async (
  baseEndpoint: string,
  address: Addr
): Promise<IndexedModule[]> => {
  const result: IndexedModule[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${baseEndpoint}/initia/move/v1/accounts/${encodeURIComponent(address)}/modules${
          paginationKey ? `?pagination.key=${paginationKey}` : ""
        }`
      )
      .then(({ data }) => parseWithError(zModulesLcdReturn, data));
    result.push(...res.modules);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return result.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
};

const zAccountModulesResponse = z.object({
  items: z.array(zIndexedModuleLcd),
  total: z.number().nonnegative(),
});
type AccountModulesResponse = z.infer<typeof zAccountModulesResponse>;

export const getModulesByAddress = async (
  endpoint: string,
  address: Addr
): Promise<AccountModulesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/move/modules`)
    .then(({ data }) => parseWithError(zAccountModulesResponse, data));

const zModuleVerificationInternal = z
  .object({
    id: z.number(),
    module_address: zHexAddr,
    module_name: z.string(),
    verified_at: z.string(),
    digest: z.string(),
    source: z.string(),
    base64: z.string(),
    chain_id: z.string(),
  })
  .transform(snakeToCamel);
export type ModuleVerificationInternal = z.infer<
  typeof zModuleVerificationInternal
>;

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

interface DecodeModuleReturn {
  abi: string;
}

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

const zModulesResponseItem = z
  .object({
    address: zHexAddr,
    module_name: z.string(),
    height: z.number(),
    latest_updated: zUtcDate,
    is_republished: z.boolean(),
    is_verified: z.boolean(),
  })
  .transform<ModuleInfo>(snakeToCamel);

const zModulesResponse = z.object({
  items: z.array(zModulesResponseItem),
  total: z.number().nonnegative(),
});
export type ModulesResponse = z.infer<typeof zModulesResponse>;

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

const zModuleDataResponse = zBaseModuleLcd
  .extend({
    recent_publish_transaction: z.string().nullable(),
    recent_publish_proposal: zProposal
      .pick({ id: true, title: true })
      .nullable(),
    recent_publish_block_height: z.number().nonnegative(),
    recent_publish_block_timestamp: zUtcDate,
    is_republished: z.boolean(),
  })
  .transform<ModuleData>((val) => ({
    ...snakeToCamel(val),
    ...indexModuleAbi(val.abi),
    recentPublishTransaction: val.recent_publish_transaction
      ? parseTxHash(val.recent_publish_transaction)
      : null,
  }));

export const getModuleData = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string
): Promise<ModuleData> =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(vmAddress)}/${encodeURIComponent(moduleName)}/info`
    )
    .then(({ data }) => parseWithError(zModuleDataResponse, data));

const zModuleTableCountsResponse = z.object({
  txs: z.number().nonnegative().nullable(),
  histories: z.number().nonnegative().nullable(),
  proposals: z.number().nonnegative().nullable(),
});
export type ModuleTableCountsResponse = z.infer<
  typeof zModuleTableCountsResponse
>;

export const getModuleTableCounts = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string
): Promise<ModuleTableCountsResponse> =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(vmAddress)}/${encodeURIComponent(moduleName)}/table-counts`
    )
    .then(({ data }) => parseWithError(zModuleTableCountsResponse, data));

const zModuleTxsResponse = z.object({
  items: z.array(zTxsResponseItem),
  total: z.number().nonnegative(),
});
export type ModuleTxsResponse = z.infer<typeof zModuleTxsResponse>;

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

const zModuleHistory = z
  .object({
    remark: zRemark,
    upgrade_policy: z.nativeEnum(UpgradePolicy),
    height: z.number().nonnegative(),
    timestamp: zUtcDate,
    previous_policy: z.nativeEnum(UpgradePolicy).nullable(),
  })
  .transform(snakeToCamel);
export type ModuleHistory = z.infer<typeof zModuleHistory>;

const zModuleHistoriesResponse = z.object({
  items: z.array(zModuleHistory),
  total: z.number().nonnegative(),
});
export type ModuleHistoriesResponse = z.infer<typeof zModuleHistoriesResponse>;

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

const zModuleRelatedProposalsResponse = z.object({
  items: z.array(zProposalsResponseItem),
  total: z.number().nonnegative(),
});
export type ModuleRelatedProposalsResponse = z.infer<
  typeof zModuleRelatedProposalsResponse
>;

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
