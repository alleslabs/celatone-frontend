import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type {
  AccountAddr,
  ExposedFunction,
  InternalModule,
  ResponseABI,
  Option,
} from "lib/types";
import { parseJsonABI, splitViewExecuteFunctions } from "lib/utils/abi";

import {
  getAccountModule,
  getAccountModules,
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

export const useAddressModules = ({
  address,
  moduleName,
  functionName,
  options = {},
}: {
  address: AccountAddr;
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
  address: AccountAddr;
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
