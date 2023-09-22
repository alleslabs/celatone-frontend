import type {
  QueryFunction,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useMoveConfig,
} from "lib/app-provider";
import type {
  MoveAccountAddr,
  ExposedFunction,
  InternalModule,
  ResponseABI,
  Option,
  HumanAddr,
  UpgradePolicy,
} from "lib/types";
import {
  bech32AddressToHex,
  parseJsonABI,
  splitViewExecuteFunctions,
  truncate,
  unpadHexAddress,
} from "lib/utils";

import {
  decodeModule,
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
      address,
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

export interface DecodeModuleQueryResponse {
  abi: ResponseABI;
  modulePath: string;
  validPublisher: boolean;
  currentPolicy: Option<UpgradePolicy>;
}

export const useDecodeModule = ({
  base64EncodedFile,
  address,
  options,
}: {
  base64EncodedFile: string;
  address: Option<HumanAddr>;
  options?: Omit<UseQueryOptions<DecodeModuleQueryResponse>, "queryKey">;
}) => {
  const baseEndpoint = useBaseApiRoute("rest");
  const move = useMoveConfig({ shouldRedirect: false });

  const queryFn = async (): Promise<DecodeModuleQueryResponse> => {
    if (!move.enabled) throw new Error("Move configuration is disabled.");
    const abi = await decodeModule(move.decodeApi, base64EncodedFile);
    const modulePath = `${truncate(abi.address)}::${abi.name}`;

    const validPublisher = address
      ? unpadHexAddress(bech32AddressToHex(address as HumanAddr)) ===
        abi.address
      : false;

    const currentPolicy = await getAccountModule(
      baseEndpoint,
      abi.address,
      abi.name
    )
      .then((data) => data.upgradePolicy)
      .catch(() => undefined);
    return { abi, modulePath, validPublisher, currentPolicy };
  };

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_DECODE,
      move.enabled,
      base64EncodedFile,
      address,
    ],
    queryFn,
    options
  );
};
