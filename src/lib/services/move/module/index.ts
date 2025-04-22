import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  AccountModulesResponse,
  DecodeModuleQueryResponse,
  ModuleHistoriesResponse,
  ModuleRelatedProposalsResponse,
  ModulesResponse,
  ModuleTableCountsResponse,
  ModuleTxsResponse,
} from "lib/services/types";
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

import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
  useInitia,
  useMoveConfig,
} from "lib/app-provider";
import { zHexAddr } from "lib/types";
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
import { getModuleByAddressRest, getModulesByAddressRest } from "./rest";

export const useModuleByAddressRest = ({
  address,
  moduleName,
  options = {},
}: {
  address: Addr;
  moduleName: string;
  options?: Omit<UseQueryOptions<IndexedModule>, "queryKey">;
}) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const queryFn = () =>
    getModuleByAddressRest(restEndpoint, address, moduleName);

  return useQuery<IndexedModule>(
    [
      CELATONE_QUERY_KEYS.MODULE_BY_ADDRESS_REST,
      restEndpoint,
      address,
      moduleName,
    ],
    queryFn,
    options
  );
};

export const useModulesByAddress = ({
  address,
  enabled = true,
  onError,
  onSuccess,
}: {
  address: Option<Addr>;
  enabled?: boolean;
  onError?: (err: AxiosError<RpcQueryError>) => void;
  onSuccess?: (data: AccountModulesResponse) => void;
}) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULES_BY_ADDRESS, restEndpoint, address],
    async () => {
      if (!address)
        throw new Error("address is undefined (useModulesByAddress)");
      return getModulesByAddressRest(restEndpoint, address);
    },
    {
      enabled,
      onError,
      onSuccess,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};

export const useFunctionView = ({
  abiData,
  fn,
  moduleAddress,
  moduleName,
  onError,
  onSuccess,
}: {
  abiData: AbiFormData;
  fn: ExposedFunction;
  moduleAddress: HexAddr;
  moduleName: string;
  onError?: (err: AxiosError<RpcQueryError>) => void;
  onSuccess?: (data: string) => void;
}): UseQueryResult<string> => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const queryFn: QueryFunction<string> = () =>
    getFunctionView(restEndpoint, moduleAddress, moduleName, fn, abiData);
  return useQuery(
    [
      CELATONE_QUERY_KEYS.FUNCTION_VIEW,
      restEndpoint,
      moduleAddress,
      moduleName,
      fn.name,
      JSON.stringify(abiData),
    ] as readonly string[],
    queryFn,
    {
      enabled: false,
      keepPreviousData: true,
      onError,
      onSuccess,
      retry: 0,
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
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const move = useMoveConfig({ shouldRedirect: false });

  const queryFn = async (): Promise<DecodeModuleQueryResponse> => {
    if (!move.enabled) throw new Error("Move configuration is disabled.");
    const abi = await decodeModule(base64EncodedFile);
    const modulePath = `${truncate(abi.address)}::${abi.name}`;

    const currentPolicy = await getModuleByAddressRest(
      restEndpoint,
      zHexAddr.parse(abi.address),
      abi.name
    )
      .then((data) => data.upgradePolicy)
      .catch(() => undefined);
    return { abi, currentPolicy, modulePath };
  };

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_DECODE,
      restEndpoint,
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
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const queryFn = async (): Promise<ExposedFunction> => {
    const fn = await decodeScript(
      `${restEndpoint}/initia/move/v1/script/abi`,
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
    [CELATONE_QUERY_KEYS.SCRIPT_DECODE, restEndpoint, base64EncodedFile],
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
    { ...options, refetchOnWindowFocus: false, retry: 1 }
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
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
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
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
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
    { refetchOnWindowFocus: false, retry: 1 }
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
    { refetchOnWindowFocus: false, retry: 1, ...options }
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
    { refetchOnWindowFocus: false, retry: 1, ...options }
  );
};
