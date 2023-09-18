import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type {
  MoveAccountAddr,
  ExposedFunction,
  InternalModule,
  ResponseABI,
  Option,
  AbiFormData,
  RpcQueryError,
} from "lib/types";
import { parseJsonABI, splitViewExecuteFunctions } from "lib/utils";

import {
  getAccountModule,
  getAccountModules,
  getFunctionView,
  getModuleVerificationStatus,
} from "./module";

export interface IndexedModule extends InternalModule {
  parsedAbi: ResponseABI;
  viewFunctions: ExposedFunction[];
  executeFunctions: ExposedFunction[];
  searchedFn: Option<ExposedFunction>;
}

const indexModuleResponse = (
  module: InternalModule,
  functionName?: string
): IndexedModule => {
  const parsedAbi = parseJsonABI(module.abi);
  const { view, execute } = splitViewExecuteFunctions(
    parsedAbi.exposed_functions
  );
  return {
    ...module,
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
  address: MoveAccountAddr;
  moduleName: Option<string>;
  functionName: Option<string>;
  options?: Omit<UseQueryOptions<IndexedModule | IndexedModule[]>, "queryKey">;
}): UseQueryResult<IndexedModule | IndexedModule[]> => {
  const baseEndpoint = useBaseApiRoute("rest");
  const queryFn: QueryFunction<IndexedModule | IndexedModule[]> = () =>
    moduleName
      ? getAccountModule(baseEndpoint, address, moduleName).then((module) =>
          indexModuleResponse(module, functionName)
        )
      : getAccountModules(baseEndpoint, address).then((modules) =>
          modules.map((module) => indexModuleResponse(module))
        );

  return useQuery(
    [
      CELATONE_QUERY_KEYS.ACCOUNT_MODULES,
      baseEndpoint,
      address as string,
      moduleName,
      functionName,
    ],
    queryFn,
    options
  );
};

export const useVerifyModule = ({
  address,
  moduleName,
}: {
  address: MoveAccountAddr;
  moduleName: string;
}) =>
  useQuery(
    [CELATONE_QUERY_KEYS.MODULE_VERIFICATION, address, moduleName],
    () => getModuleVerificationStatus(address, moduleName),
    {
      enabled: Boolean(address && moduleName),
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

export const useFunctionView = ({
  moduleAddress,
  moduleName,
  fn,
  abiData,
  onSuccess,
  onError,
}: {
  moduleAddress: MoveAccountAddr;
  moduleName: string;
  fn: ExposedFunction;
  abiData: AbiFormData;
  onSuccess?: (data: string) => void;
  onError?: (err: AxiosError<RpcQueryError>) => void;
}): UseQueryResult<string> => {
  // TODO: handle POST in celatone API
  const baseEndpoint = "https://stone-rest.initia.tech";
  const queryFn: QueryFunction<string> = () =>
    getFunctionView(baseEndpoint, moduleAddress, moduleName, fn, abiData);
  return useQuery(
    [
      CELATONE_QUERY_KEYS.FUNCTION_VIEW,
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
