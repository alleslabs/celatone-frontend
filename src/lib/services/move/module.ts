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
} from "lib/types";
import { zHexAddr, UpgradePolicy } from "lib/types";
import {
  libDecode,
  parseJsonABI,
  serializeAbiData,
  snakeToCamel,
} from "lib/utils";

const zModulesResponseItem = z
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

const zModulesResponse = z.object({
  items: z.array(zModulesResponseItem),
  total: z.number(),
});
type ModulesResponse = z.infer<typeof zModulesResponse>;

// TODO: This function will replace getAccountModules later
export const getAPIAccountModules = async (
  endpoint: string,
  address: MoveAccountAddr
): Promise<ModulesResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/move/modules`)
    .then((res) => zModulesResponse.parse(res.data));

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
  address: MoveAccountAddr,
  moduleName: string
): Promise<Nullable<ModuleVerificationInternal>> =>
  // TODO: move url to base api route? wait for celatone api implementation?
  axios
    .get<ModuleVerificationReturn>(
      `https://stone-compiler.initia.tech/contracts/verify/${address}/${moduleName}`
    )
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
    .then((res) => res.data);
