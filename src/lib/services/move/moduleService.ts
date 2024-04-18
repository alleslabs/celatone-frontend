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
  useCelatoneApp,
  useGovConfig,
  useMoveConfig,
} from "lib/app-provider";
import {
  getModuleHistoriesCountQueryDocument,
  getModuleHistoriesQueryDocument,
  getModuleIdByNameAndVmAddressQueryDocument,
  getModuleInitialPublishInfoQueryDocument,
} from "lib/query";
import type {
  AbiFormData,
  Addr,
  ExposedFunction,
  HexAddr,
  InternalModule,
  ModuleHistory,
  Nullable,
  Option,
  ResponseABI,
  RpcQueryError,
  UpgradePolicy,
} from "lib/types";
import {
  parseDate,
  parseDateOpt,
  parseJsonABI,
  parseTxHashOpt,
  splitViewExecuteFunctions,
  truncate,
} from "lib/utils";

import type { ModulesResponse, ModuleVerificationInternal } from "./module";
import {
  decodeModule,
  decodeScript,
  getAccountModule,
  getAccountModules,
  getFunctionView,
  getModules,
  getModulesByAddress,
  getModuleVerificationStatus,
} from "./module";

export interface IndexedModule extends InternalModule {
  address: HexAddr;
  parsedAbi: ResponseABI;
  viewFunctions: ExposedFunction[];
  executeFunctions: ExposedFunction[];
  searchedFn: Option<ExposedFunction>;
}

const indexModuleResponse = (
  module: InternalModule,
  functionName?: string
): IndexedModule => {
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
    searchedFn: parsedAbi.exposed_functions.find(
      (fn) => fn.name === functionName
    ),
  };
};

export const useAccountModules = ({
  address,
  moduleName,
  functionName,
  options = {},
}: {
  address: Addr;
  moduleName: Option<string>;
  functionName?: Option<string>;
  options?: Omit<UseQueryOptions<IndexedModule | IndexedModule[]>, "queryKey">;
}): UseQueryResult<IndexedModule | IndexedModule[]> => {
  const baseEndpoint = useBaseApiRoute("rest");
  const queryFn: QueryFunction<IndexedModule | IndexedModule[]> = () =>
    moduleName
      ? getAccountModule(baseEndpoint, address, moduleName).then((module) =>
          indexModuleResponse(module, functionName)
        )
      : getAccountModules(baseEndpoint, address).then((modules) =>
          modules
            .sort((a, b) => a.moduleName.localeCompare(b.moduleName))
            .map((module) => indexModuleResponse(module))
        );

  return useQuery(
    [
      CELATONE_QUERY_KEYS.ACCOUNT_MODULES,
      baseEndpoint,
      address,
      moduleName,
      functionName,
    ],
    queryFn,
    options
  );
};

export const useModulesByAddress = (address: Option<Addr>) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled } = useMoveConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULES_BY_ADDRESS, endpoint, address],
    async () => {
      if (!address) throw new Error("address is undefined");
      return getModulesByAddress(endpoint, address).then((modules) =>
        modules.items.map((module) => indexModuleResponse(module))
      );
    },
    {
      enabled,
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
export interface DecodeModuleQueryResponse {
  abi: ResponseABI;
  modulePath: string;
  currentPolicy: Option<UpgradePolicy>;
}

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

    const currentPolicy = await getAccountModule(
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

export const useModuleId = (moduleName: string, vmAddress: HexAddr) => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = async () => {
    return indexerGraphClient
      .request(getModuleIdByNameAndVmAddressQueryDocument, {
        name: moduleName,
        vmAddress,
      })
      .then<Nullable<number>>(({ modules }) => modules[0]?.id ?? null);
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULE_ID, indexerGraphClient, moduleName, vmAddress],
    queryFn,
    {
      enabled: Boolean(moduleName && vmAddress),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useModuleHistoriesByPagination = ({
  moduleId,
  offset,
  pageSize,
}: {
  moduleId: Option<Nullable<number>>;
  offset: number;
  pageSize: number;
}): UseQueryResult<ModuleHistory[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = async () => {
    if (!moduleId) return [];
    return indexerGraphClient
      .request(getModuleHistoriesQueryDocument, {
        moduleId,
        pageSize: pageSize + 1,
        offset,
      })
      .then(({ module_histories }) =>
        module_histories
          .map<ModuleHistory>((history, idx) => ({
            remark: history.remark,
            upgradePolicy: history.upgrade_policy,
            height: history.block.height,
            timestamp: parseDate(history.block.timestamp),
            previousPolicy:
              idx === module_histories.length - 1
                ? undefined
                : module_histories[idx + 1].upgrade_policy,
          }))
          .slice(0, pageSize)
      );
  };

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_HISTORIES,
      indexerGraphClient,
      moduleId,
      pageSize,
      offset,
    ],
    queryFn,
    {
      enabled: Boolean(moduleId),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useModuleHistoriesCount = (moduleId: Option<Nullable<number>>) => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = async () => {
    if (!moduleId) throw new Error("Module id not found");
    return indexerGraphClient
      .request(getModuleHistoriesCountQueryDocument, {
        moduleId,
      })
      .then(
        ({ module_histories_aggregate }) =>
          module_histories_aggregate.aggregate?.count
      );
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULE_HISTORIES_COUNT, indexerGraphClient, moduleId],
    queryFn,
    {
      enabled: Boolean(moduleId),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export interface ModuleInitialPublishInfo {
  publisherVmAddress: HexAddr;
  createdHeight: Option<number>;
  createdTime: Option<Date>;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
}

export const useModuleDetailsQuery = (
  moduleId: Option<Nullable<number>>
): UseQueryResult<ModuleInitialPublishInfo> => {
  const { indexerGraphClient } = useCelatoneApp();
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  const queryFn = async () => {
    if (!moduleId) throw new Error("Module id not found");
    return indexerGraphClient
      .request(getModuleInitialPublishInfoQueryDocument, { moduleId, isGov })
      .then<ModuleInitialPublishInfo>(({ modules }) => {
        const target = modules[0];
        if (!target) throw new Error(`Cannot find module with id ${moduleId}`);
        return {
          publisherVmAddress: target.publisher_vm_address.vm_address as HexAddr,
          createdHeight: target.module_histories?.[0]?.block.height,
          createdTime: parseDateOpt(
            target.module_histories?.[0]?.block.timestamp
          ),
          initTxHash: parseTxHashOpt(target.publish_transaction?.hash),
          initProposalId: target.module_proposals?.[0]?.proposal.id,
          initProposalTitle: target.module_proposals?.[0]?.proposal.title,
        };
      });
  };

  return useQuery(
    [CELATONE_QUERY_KEYS.MODULE_DETAILS, indexerGraphClient, moduleId],
    queryFn,
    {
      enabled: Boolean(moduleId),
      refetchOnWindowFocus: false,
    }
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
