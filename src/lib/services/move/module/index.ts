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
  AccountModulesResponse,
  DecodeModuleQueryResponse,
  ModuleHistoriesResponse,
  ModuleRelatedProposalsResponse,
  ModulesResponse,
  ModuleTableCountsResponse,
  ModuleTxsResponse,
} from "lib/services/types";
import { getMoveVerifyInfosByAddress } from "lib/services/verification/move/api";
import type {
  AbiFormData,
  Addr,
  ExposedFunction,
  HexAddr,
  IndexedModule,
  ModulePublishInfo,
  Option,
  RpcQueryError,
} from "lib/types";
import { truncate } from "lib/utils";

import {
  decodeModule,
  decodeScript,
  getFunctionView,
  getModuleHistories,
  getModulePublishInfo,
  getModuleRelatedProposals,
  getModules,
  getModuleTableCounts,
  getModuleTxs,
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
}) => {
  const endpoint = useLcdEndpoint();
  const queryFn = () => getModuleByAddressLcd(endpoint, address, moduleName);

  return useQuery<IndexedModule>(
    [CELATONE_QUERY_KEYS.MODULE_BY_ADDRESS_LCD, endpoint, address, moduleName],
    queryFn,
    options
  );
};

export const useModulesByAddress = ({
  address,
  enabled = true,
  onSuccess,
  onError,
}: {
  address: Option<Addr>;
  enabled?: boolean;
  onSuccess?: (data: AccountModulesResponse) => void;
  onError?: (err: AxiosError<RpcQueryError>) => void;
}) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULES_BY_ADDRESS, endpoint, address],
    async () => {
      if (!address)
        throw new Error("address is undefined (useModulesByAddress)");

      return Promise.allSettled([
        getModulesByAddressLcd(endpoint, address),
        getMoveVerifyInfosByAddress(address),
      ]).then(([modules, modulesVerified]) => {
        if (modules.status === "rejected")
          return {
            total: 0,
            items: [],
          };

        let modulesVerifiedMapping = new Map();

        if (modulesVerified.status === "fulfilled") {
          modulesVerifiedMapping = modulesVerified.value.contracts.reduce(
            (acc, { moduleName }) => {
              acc.set(moduleName, true);
              return acc;
            },
            new Map<string, boolean>()
          );
        }

        return {
          ...modules.value,
          items: modules.value.items.map((module) => ({
            ...module,
            isVerified: modulesVerifiedMapping.has(module.moduleName),
          })),
        };
      });
    },
    {
      enabled,
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess,
      onError,
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
  const lcdEndpoint = useLcdEndpoint();
  const queryFn: QueryFunction<string> = () =>
    getFunctionView(lcdEndpoint, moduleAddress, moduleName, fn, abiData);
  return useQuery(
    [
      CELATONE_QUERY_KEYS.FUNCTION_VIEW,
      lcdEndpoint,
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
  const endpoint = useLcdEndpoint();
  const move = useMoveConfig({ shouldRedirect: false });

  const queryFn = async (): Promise<DecodeModuleQueryResponse> => {
    if (!move.enabled) throw new Error("Move configuration is disabled.");
    const abi = await decodeModule(base64EncodedFile);
    const modulePath = `${truncate(abi.address)}::${abi.name}`;

    const currentPolicy = await getModuleByAddressLcd(
      endpoint,
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
      endpoint,
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
  const endpoint = useLcdEndpoint();

  const queryFn = async (): Promise<ExposedFunction> => {
    const fn = await decodeScript(
      `${endpoint}/initia/move/v1/script/abi`,
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
    [CELATONE_QUERY_KEYS.SCRIPT_DECODE, endpoint, base64EncodedFile],
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

export const useModulePublishInfo = (
  vmAddress: HexAddr,
  moduleName: string,
  enabled = true
) => {
  const endpoint = useBaseApiRoute("modules");
  const govConfig = useGovConfig({ shouldRedirect: false });

  return useQuery<ModulePublishInfo>(
    [
      CELATONE_QUERY_KEYS.MODULE_DATA,
      endpoint,
      vmAddress,
      moduleName,
      govConfig.enabled,
    ],
    async () =>
      getModulePublishInfo(endpoint, vmAddress, moduleName, govConfig.enabled),
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
  enabled = true
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
      enabled,
    }
  );
};

export const useModuleTxs = (
  vmAddress: HexAddr,
  moduleName: string,
  limit: number,
  offset: number
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
    { retry: 1, refetchOnWindowFocus: false }
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
