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
  useMoveConfig,
} from "lib/app-provider";
import type {
  MoveAccountAddr,
  ExposedFunction,
  InternalModule,
  ResponseABI,
  Option,
  AbiFormData,
  RpcQueryError,
  HumanAddr,
  UpgradePolicy,
  HexAddr,
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
  getFunctionView,
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
  const parsedAbi = parseJsonABI(module.abi);
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
  address: MoveAccountAddr;
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

export const useVerifyModule = ({
  address,
  moduleName,
}: {
  address: Option<MoveAccountAddr>;
  moduleName: Option<string>;
}) =>
  useQuery(
    [CELATONE_QUERY_KEYS.MODULE_VERIFICATION, address, moduleName],
    () => {
      if (!address || !moduleName) return null;
      return getModuleVerificationStatus(address, moduleName);
    },
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
      abi.address as HexAddr,
      abi.name
    )
      .then((data) => data.upgradePolicy)
      .catch(() => undefined);
    return { abi, modulePath, validPublisher, currentPolicy };
  };

  return useQuery(
    [
      CELATONE_QUERY_KEYS.MODULE_DECODE,
      baseEndpoint,
      move.enabled,
      address,
      base64EncodedFile,
    ],
    queryFn,
    options
  );
};
