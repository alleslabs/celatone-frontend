import axios from "axios";
import { z } from "zod";

import { zProposal, zProposalsResponseItem } from "../proposal";
import { zTxsResponseItem } from "../tx";
import type {
  AbiFormData,
  Addr,
  ExposedFunction,
  HexAddr,
  IndexedModule,
  InternalModule,
  ModuleData,
  ModuleInfo,
  Nullable,
  ResponseABI,
  ResponseModule,
  SnakeToCamelCaseNested,
} from "lib/types";
import { UpgradePolicy, zHexAddr, zRemark, zUtcDate } from "lib/types";
import type { Pagination } from "lib/types/rest";
import {
  libDecode,
  parseJsonABI,
  parseTxHash,
  parseWithError,
  serializeAbiData,
  snakeToCamel,
  splitViewExecuteFunctions,
} from "lib/utils";

const indexModuleAbi = (module: InternalModule): IndexedModule => {
  const parsedAbi = parseJsonABI<ResponseABI>(module.abi);
  const { view, execute } = splitViewExecuteFunctions(
    parsedAbi.exposed_functions
  );
  return {
    ...module,
    address: module.address as HexAddr,
    parsedAbi,
    viewFunctions: view,
    executeFunctions: execute,
  };
};

interface ModuleReturn {
  module: ResponseModule;
}

export const getModuleByAddressLcd = async (
  baseEndpoint: string,
  address: Addr,
  moduleName: string
): Promise<IndexedModule> => {
  const { data } = await axios.get<ModuleReturn>(
    `${baseEndpoint}/initia/move/v1/accounts/${address}/modules/${moduleName}`
  );
  return indexModuleAbi(snakeToCamel(data.module));
};

const zAccountModulesResponseItem = z
  .object({
    abi: z.string(),
    address: zHexAddr,
    module_name: z.string(),
    raw_bytes: z.string(),
    upgrade_policy: z.nativeEnum(UpgradePolicy),
  })
  .transform((val) => indexModuleAbi(snakeToCamel(val)));

const zAccountModulesResponse = z.object({
  items: z.array(zAccountModulesResponseItem),
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

interface ModulesReturn {
  modules: ResponseModule[];
  pagination: Pagination;
}

export const getModulesByAddressLcd = async (
  baseEndpoint: string,
  address: Addr
): Promise<IndexedModule[]> => {
  const result: ResponseModule[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const { data } = await axios.get<ModulesReturn>(
      `${baseEndpoint}/initia/move/v1/accounts/${address}/modules${
        paginationKey ? `?pagination.key=${paginationKey}` : ""
      }`
    );
    result.push(...data.modules);
    if (data.pagination.next_key) await fetchFn(data.pagination.next_key);
  };

  await fetchFn(null);

  return snakeToCamel(result)
    .sort((a, b) => a.moduleName.localeCompare(b.moduleName))
    .map((module) => indexModuleAbi(module));
};

interface ModuleVerificationReturn {
  id: number;
  module_address: HexAddr;
  module_name: string;
  verified_at: string;
  digest: string;
  source: string;
  base64: string;
  chain_id: string;
}

// TODO: Figure out how to correctly infer NominalType intersection
export interface ModuleVerificationInternal
  extends Omit<
    SnakeToCamelCaseNested<ModuleVerificationReturn>,
    "moduleAddress"
  > {
  moduleAddress: HexAddr;
}

export const getModuleVerificationStatus = async (
  endpoint: string,
  address: Addr,
  moduleName: string
): Promise<Nullable<ModuleVerificationInternal>> =>
  axios
    .get<ModuleVerificationReturn>(`${endpoint}/${address}/${moduleName}`)
    .then(({ data }) => ({
      ...snakeToCamel(data),
      moduleAddress: data.module_address,
    }))
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
): Promise<ResponseABI> =>
  axios
    .post<DecodeModuleReturn>(decodeAPI, {
      code_bytes: moduleEncode,
    })
    .then(({ data }) => parseJsonABI<ResponseABI>(libDecode(data.abi)));

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

const zModuleDataResponse = z
  .object({
    abi: z.string(),
    address: zHexAddr,
    module_name: z.string(),
    raw_bytes: z.string(),
    upgrade_policy: z.nativeEnum(UpgradePolicy),
    recent_publish_transaction: z.string().nullable(),
    recent_publish_proposal: zProposal
      .pick({ id: true, title: true })
      .nullable(),
    recent_publish_block_height: z.number().nonnegative(),
    recent_publish_block_timestamp: zUtcDate,
    is_republished: z.boolean(),
  })
  .transform<ModuleData>(
    ({
      recent_publish_transaction,
      recent_publish_proposal,
      recent_publish_block_height,
      recent_publish_block_timestamp,
      is_republished,
      ...internalModule
    }) => ({
      ...indexModuleAbi(snakeToCamel(internalModule)),
      recentPublishTransaction: recent_publish_transaction
        ? parseTxHash(recent_publish_transaction)
        : null,
      recentPublishProposal: recent_publish_proposal,
      recentPublishBlockHeight: recent_publish_block_height,
      recentPublishBlockTimestamp: recent_publish_block_timestamp,
      isRepublished: is_republished,
    })
  );

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
