import axios from "axios";
import { z } from "zod";

import type {
  MoveAccountAddr,
  ResponseModule,
  ResponseModules,
  InternalModule,
  HexAddr,
  SnakeToCamelCaseNested,
  ResponseABI,
  ExposedFunction,
  AbiFormData,
  Nullable,
  ModuleInfo,
} from "lib/types";
import { zHexAddr, UpgradePolicy, zHumanAddr, zUtcDate } from "lib/types";
import {
  libDecode,
  parseJsonABI,
  serializeAbiData,
  snakeToCamel,
} from "lib/utils";

const zAccountModulesResponseItem = z
  .object({
    abi: z.string(),
    address: zHexAddr,
    module_name: z.string(),
    raw_bytes: z.string(),
    upgrade_policy: z.nativeEnum(UpgradePolicy),
  })
  .transform((val) => ({
    abi: val.abi,
    address: val.address,
    moduleName: val.module_name,
    rawBytes: val.raw_bytes,
    upgradePolicy: val.upgrade_policy,
  }));

const zAccountModulesResponse = z.object({
  items: z.array(zAccountModulesResponseItem),
  total: z.number().nonnegative(),
});
type AccountModulesResponse = z.infer<typeof zAccountModulesResponse>;

export const getModulesByAddress = async (
  endpoint: string,
  address: MoveAccountAddr
): Promise<AccountModulesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/move/modules`)
    .then((res) => zAccountModulesResponse.parse(res.data));

export const getAccountModules = async (
  baseEndpoint: string,
  address: MoveAccountAddr
): Promise<InternalModule[]> => {
  const result: ResponseModule[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const { data } = await axios.get<ResponseModules>(
      `${baseEndpoint}/initia/move/v1/accounts/${address}/modules${
        paginationKey ? `?pagination.key=${paginationKey}` : ""
      }`
    );
    result.push(...data.modules);
    if (data.pagination.next_key) await fetchFn(data.pagination.next_key);
  };

  await fetchFn(null);

  return snakeToCamel(result);
};

interface ModuleReturn {
  module: ResponseModule;
}

export const getAccountModule = async (
  baseEndpoint: string,
  address: MoveAccountAddr,
  moduleName: string
): Promise<InternalModule> => {
  const { data } = await axios.get<ModuleReturn>(
    `${baseEndpoint}/initia/move/v1/accounts/${address}/modules/${moduleName}`
  );
  return snakeToCamel(data.module);
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
  address: MoveAccountAddr,
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
  address: MoveAccountAddr,
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
    address: zHumanAddr,
    name: z.string(),
    height: z.number(),
    latest_updated: zUtcDate,
    is_republished: z.boolean(),
    is_verified: z.boolean(),
  })
  .transform<ModuleInfo>((val) => ({
    address: val.address,
    name: val.name,
    height: val.height,
    latestUpdated: val.latest_updated,
    isRepublished: val.is_republished,
    isVerified: val.is_verified,
  }));

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
    .then((res) => zModulesResponse.parse(res.data));
