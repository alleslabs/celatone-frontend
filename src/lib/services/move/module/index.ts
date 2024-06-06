import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
  useInitia,
  useLcdEndpoint,
  useMoveConfig,
} from "lib/app-provider";
import type {
  DecodeModuleQueryResponse,
  ModuleHistoriesResponse,
  ModuleRelatedProposalsResponse,
  ModulesResponse,
  ModuleTableCountsResponse,
  ModuleTxsResponse,
  ModuleVerificationInternal,
} from "lib/services/types";
import type {
  AbiFormData,
  Addr,
  ExposedFunction,
  HexAddr,
  IndexedModule,
  ModuleData,
  Nullable,
  Option,
  RpcQueryError,
} from "lib/types";
import { truncate } from "lib/utils";

import {
  decodeModule,
  decodeScript,
  getFunctionView,
  getModuleData,
  getModuleHistories,
  getModuleRelatedProposals,
  getModules,
  getModulesByAddress,
  getModuleTableCounts,
  getModuleTxs,
  getModuleVerificationStatus,
} from "./api";
import { getModuleByAddressLcd, getModulesByAddressLcd } from "./lcd";

export const useModuleByAddressLcd = ({
  address,
  moduleName,
  options = {},
}: {
  address: Addr;
  moduleName: string;
  options?: Omit<UseQueryOptions<IndexedModule>, "queryKey">;
}): UseQueryResult => {
  const endpoint = useLcdEndpoint();
  const queryFn = () => getModuleByAddressLcd(endpoint, address, moduleName);

  return useQuery<IndexedModule>(
    [CELATONE_QUERY_KEYS.ACCOUNT_MODULE, endpoint, address, moduleName],
    queryFn,
    options
  );
};

export const useModulesByAddressLcd = ({
  address,
  options = {},
}: {
  address: Option<Addr>;
  options?: Omit<UseQueryOptions<{ items: IndexedModule[] }>, "queryKey">;
}) => {
  const lcdEndpoint = useLcdEndpoint();
  const queryFn = () => {
    if (!address) throw new Error("address is undefined");
    return getModulesByAddressLcd(lcdEndpoint, address);
  };

  return useQuery<{ items: IndexedModule[] }>(
    [CELATONE_QUERY_KEYS.ACCOUNT_MODULES, lcdEndpoint, address],
    queryFn,
    options
  );
};

export const useModulesByAddress = (address: Option<Addr>, enabled = true) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: moveEnabled } = useMoveConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULES_BY_ADDRESS, endpoint, address],
    async () => {
      if (!address) throw new Error("address is undefined");
      return getModulesByAddress(endpoint, address);
    },
    {
      enabled: enabled && moveEnabled,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};

export const useVerifyModule = ({
  address,
  moduleName,
}: {
  address: Option<Addr>;
  moduleName: Option<string>;
}): UseQueryResult<Nullable<ModuleVerificationInternal>> => {
  const move = useMoveConfig({ shouldRedirect: false });
  const endpoint = move.enabled ? move.verify : "";

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULE_VERIFICATION, endpoint, address, moduleName],
    () => {
      if (!endpoint || !address || !moduleName) return null;
      return getModuleVerificationStatus(endpoint, address, moduleName);
    },
    {
      enabled: Boolean(address && moduleName),
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};

export const useFunctionView = ({
  moduleAddress,
  moduleName,
  fn,
  abiData,
  onSuccess,
  onError,
}: {
  moduleAddress: HexAddr;
  moduleName: string;
  fn: ExposedFunction;
  abiData: AbiFormData;
  onSuccess?: (data: string) => void;
  onError?: (err: AxiosError<RpcQueryError>) => void;
}): UseQueryResult<string> => {
  const baseEndpoint = useBaseApiRoute("rest");
  const queryFn: QueryFunction<string> = () =>
    getFunctionView(baseEndpoint, moduleAddress, moduleName, fn, abiData);
  return useQuery(
    [
      CELATONE_QUERY_KEYS.FUNCTION_VIEW,
      baseEndpoint,
      moduleAddress,
      moduleName,
      fn.name,
      JSON.stringify(abiData),
    ] as readonly string[],
    queryFn,
    {
      enabled: false,
      retry: 0,
      keepPreviousData: true,
      onSuccess,
      onError,
    }
  );
};

export const useDecodeModule = ({
  base64EncodedFile,
  options,
}: {
  base64EncodedFile: string;
  options?: Omit<UseQueryOptions<DecodeModuleQueryResponse>, "queryKey">;
}) => {
  const baseEndpoint = useBaseApiRoute("rest");
  const move = useMoveConfig({ shouldRedirect: false });

  const queryFn = async (): Promise<DecodeModuleQueryResponse> => {
    if (!move.enabled) throw new Error("Move configuration is disabled.");
    const abi = await decodeModule(move.decodeApi, base64EncodedFile);
    const modulePath = `${truncate(abi.address)}::${abi.name}`;

    const currentPolicy = await getModuleByAddressLcd(
      baseEndpoint,
      abi.address as HexAddr,
      abi.name
    )
      .then((data) => data.upgradePolicy)
      .catch(() => undefined);
    return { abi, modulePath, currentPolicy };
  };

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_DECODE,
      baseEndpoint,
      move.enabled,
      base64EncodedFile,
    ],
    queryFn,
    options
  );
};

export const useDecodeScript = ({
  base64EncodedFile,
  options,
}: {
  base64EncodedFile: string;
  options?: Omit<UseQueryOptions<ExposedFunction>, "queryKey">;
}): UseQueryResult<ExposedFunction> => {
  const lcd = useBaseApiRoute("rest");

  const queryFn = async (): Promise<ExposedFunction> => {
    const fn = await decodeScript(
      `${lcd}/initia/move/v1/script/abi`,
      base64EncodedFile
    );
    return {
      ...fn,
      params:
        fn.params[0] === "signer" || fn.params[0] === "&signer"
          ? fn.params.slice(1)
          : fn.params,
    };
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.SCRIPT_DECODE, lcd, base64EncodedFile],
    queryFn,
    options
  );
};

export const useModules = (
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<ModulesResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("modules");

  return useQuery<ModulesResponse>(
    [CELATONE_QUERY_KEYS.MODULES, endpoint, limit, offset],
    async () => getModules(endpoint, limit, offset),
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useModuleData = (
  vmAddress: HexAddr,
  moduleName: string,
  enabled = true
): UseQueryResult => {
  const endpoint = useBaseApiRoute("modules");
  const govConfig = useGovConfig({ shouldRedirect: false });

  return useQuery<ModuleData>(
    [
      CELATONE_QUERY_KEYS.MODULE_DATA,
      endpoint,
      vmAddress,
      moduleName,
      govConfig.enabled,
    ],
    async () =>
      getModuleData(endpoint, vmAddress, moduleName, govConfig.enabled),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useModuleTableCounts = (
  vmAddress: HexAddr,
  moduleName: string,
  options: UseQueryOptions<ModuleTableCountsResponse> = {}
) => {
  const endpoint = useBaseApiRoute("modules");
  const govConfig = useGovConfig({ shouldRedirect: false });

  return useQuery<ModuleTableCountsResponse>(
    [
      CELATONE_QUERY_KEYS.MODULE_TABLE_COUNTS,
      endpoint,
      vmAddress,
      moduleName,
      govConfig.enabled,
    ],
    async () =>
      getModuleTableCounts(endpoint, vmAddress, moduleName, govConfig.enabled),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useModuleTxs = (
  vmAddress: HexAddr,
  moduleName: string,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<ModuleTxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("move");
  const isInitia = useInitia();

  return useQuery<ModuleTxsResponse>(
    [
      CELATONE_QUERY_KEYS.MODULE_TXS,
      endpoint,
      vmAddress,
      moduleName,
      limit,
      offset,
      isInitia,
    ],
    async () =>
      getModuleTxs(endpoint, vmAddress, moduleName, limit, offset, isInitia),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useModuleHistories = (
  vmAddress: HexAddr,
  moduleName: string,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<ModuleHistoriesResponse>, "onSuccess"> = {}
): UseQueryResult<ModuleHistoriesResponse> => {
  const endpoint = useBaseApiRoute("move");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_HISTORIES,
      endpoint,
      vmAddress,
      moduleName,
      limit,
      offset,
    ],
    async () =>
      getModuleHistories(endpoint, vmAddress, moduleName, limit, offset),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useModuleRelatedProposals = (
  vmAddress: HexAddr,
  moduleName: string,
  limit: number,
  offset: number,
  options: Pick<
    UseQueryOptions<ModuleRelatedProposalsResponse>,
    "onSuccess"
  > = {}
): UseQueryResult<ModuleRelatedProposalsResponse> => {
  const endpoint = useBaseApiRoute("move");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_PROPOSALS,
      endpoint,
      vmAddress,
      moduleName,
      limit,
      offset,
    ],
    async () =>
      getModuleRelatedProposals(endpoint, vmAddress, moduleName, limit, offset),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};
