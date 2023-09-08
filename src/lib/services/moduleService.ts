import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type {
  MoveAccountAddr,
  ExposedFunction,
  InternalModule,
  ResponseABI,
} from "lib/types";
import { parseJsonABI, splitViewExecuteFunctions } from "lib/utils";

import {
  getAccountModule,
  getAccountModules,
  getModuleVerificationStatus,
} from "./module";

export interface IndexedModule extends InternalModule {
  parsedAbi: ResponseABI;
  viewFunctions: ExposedFunction[];
  executeFunctions: ExposedFunction[];
}

const indexModuleResponse = (module: InternalModule): IndexedModule => {
  const parsedAbi = parseJsonABI(module.abi);
  const { view, execute } = splitViewExecuteFunctions(
    parsedAbi.exposed_functions
  );
  return {
    ...module,
    parsedAbi,
    viewFunctions: view,
    executeFunctions: execute,
  };
};

export const useAddressModules = ({
  address,
  moduleName,
  options = {},
}: {
  address: MoveAccountAddr;
  moduleName: string;
  options?: Omit<UseQueryOptions<IndexedModule | IndexedModule[]>, "queryKey">;
}): UseQueryResult<IndexedModule | IndexedModule[]> => {
  const baseEndpoint = useBaseApiRoute("rest");
  const queryFn: QueryFunction<IndexedModule | IndexedModule[]> = () =>
    moduleName
      ? getAccountModule(baseEndpoint, address, moduleName).then((module) =>
          indexModuleResponse(module)
        )
      : getAccountModules(baseEndpoint, address).then((modules) =>
          modules.map((module) => indexModuleResponse(module))
        );

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_MODULES, baseEndpoint, address, moduleName],
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
