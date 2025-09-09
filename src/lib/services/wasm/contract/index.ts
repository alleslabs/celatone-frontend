import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type {
  ContractData,
  ContractsResponse,
  ContractTableCounts,
  MigrationHistoriesResponse,
} from "lib/services/types";
import type {
  BechAddr,
  BechAddr32,
  Dict,
  JsonDataType,
  Option,
} from "lib/types";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
  useTierConfig,
} from "lib/app-provider";

import {
  getAdminContractsByAddress,
  getAdminsByContractAddresses,
  getAllAdminContractsByAddress,
  getAllInstantiatedContractsByAddress,
  getContractData,
  getContracts,
  getContractsByCodeId,
  getContractTableCounts,
  getInstantiatedContractsByAddress,
  getMigrationHistoriesByContractAddress,
} from "./api";
import {
  getContractCw2InfoRest,
  getContractQueryMsgsRest,
  getContractQueryRest,
  getContractRest,
  getContractsByCodeIdRest,
  getInstantiatedContractsByAddressRest,
  getMigrationHistoriesByContractAddressRest,
} from "./rest";

export const useContracts = (
  limit: number,
  offset: number,
  options?: Partial<UseQueryOptions<ContractsResponse>>
) => {
  const endpoint = useBaseApiRoute("contracts");

  return useQuery<ContractsResponse>({
    queryFn: async () => getContracts(endpoint, limit, offset),
    queryKey: [CELATONE_QUERY_KEYS.CONTRACTS, endpoint, limit, offset],
    retry: 1,
    ...options,
  });
};

export const useMigrationHistoriesByContractAddress = (
  contractAddress: BechAddr32,
  offset: number,
  limit: number,
  options?: UseQueryOptions<MigrationHistoriesResponse>
) => {
  const endpoint = useBaseApiRoute("contracts");

  return useQuery<MigrationHistoriesResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () =>
      getMigrationHistoriesByContractAddress(
        endpoint,
        contractAddress,
        limit,
        offset
      ),
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_MIGRATION_HISTORIES_BY_CONTRACT_ADDRESS,
      endpoint,
      contractAddress,
      limit,
      offset,
    ],
    retry: 1,
    ...options,
  });
};

export const useMigrationHistoriesByContractAddressRest = (
  contractAddress: BechAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: async () =>
      getMigrationHistoriesByContractAddressRest(restEndpoint, contractAddress),
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_MIGRATION_HISTORIES_BY_CONTRACT_ADDRESS_REST,
      restEndpoint,
      contractAddress,
    ],
    retry: 1,
  });
};

export const useInstantiatedContractsByAddress = (
  address: Option<BechAddr>,
  limit: number,
  offset: number,
  enabled = true
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery({
    enabled: Boolean(address) && enabled,
    queryFn: async () => {
      if (!address)
        throw new Error(
          "address not found (getInstantiatedContractsByAddress)"
        );

      return getInstantiatedContractsByAddress(
        endpoint,
        address,
        limit,
        offset
      );
    },
    queryKey: [
      CELATONE_QUERY_KEYS.INSTANTIATED_CONTRACTS_BY_ADDRESS,
      endpoint,
      address,
      limit,
      offset,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAllInstantiatedContractsByAddress = (
  address: Option<BechAddr>,
  enabled = true
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery({
    enabled: Boolean(address) && enabled,
    queryFn: async () => {
      if (!address)
        throw new Error(
          "address not found (getAllInstantiatedContractsByAddress)"
        );

      return getAllInstantiatedContractsByAddress(endpoint, address);
    },

    queryKey: [
      CELATONE_QUERY_KEYS.ALL_INSTANTIATED_CONTRACTS_BY_ADDRESS,
      endpoint,
      address,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAdminContractsByAddress = (
  address: BechAddr,
  limit: number,
  offset: number
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery({
    queryFn: async () =>
      getAdminContractsByAddress(endpoint, address, limit, offset),
    queryKey: [
      CELATONE_QUERY_KEYS.ADMIN_CONTRACTS_BY_ADDRESS,
      endpoint,
      address,
      limit,
      offset,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useContractData = (
  contractAddress: BechAddr32,
  options?: Partial<UseQueryOptions<ContractData>>
) => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("contracts");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const endpoint = isFullTier ? apiEndpoint : restEndpoint;
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  return useQuery<ContractData>({
    queryFn: async () =>
      isFullTier
        ? getContractData(endpoint, contractAddress, isGov)
        : getContractRest(endpoint, contractAddress),
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_DATA,
      endpoint,
      contractAddress,
      isGov,
      isFullTier,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useContractTableCounts = (
  contractAddress: BechAddr32,
  options: Partial<UseQueryOptions<ContractTableCounts>> = {}
) => {
  const endpoint = useBaseApiRoute("contracts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  return useQuery<ContractTableCounts>({
    queryFn: async () =>
      getContractTableCounts(endpoint, contractAddress, isGov),
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_TABLE_COUNTS,
      endpoint,
      contractAddress,
      isGov,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useContractQueryMsgsRest = (contractAddress: BechAddr32) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    enabled: !!contractAddress,
    gcTime: 0,
    queryFn: async () =>
      getContractQueryMsgsRest(restEndpoint, contractAddress),
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_QUERY_MSGS,
      restEndpoint,
      contractAddress,
    ],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useContractsByCodeId = (
  codeId: number,
  limit: number,
  offset: number
) => {
  const endpoint = useBaseApiRoute("codes");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID,
      endpoint,
      codeId,
      limit,
      offset,
    ],
    queryFn: async () => getContractsByCodeId(endpoint, codeId, limit, offset),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useContractsByCodeIdRest = (codeId: number) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID_REST,
      restEndpoint,
      codeId,
    ],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getContractsByCodeIdRest(restEndpoint, codeId, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
  });
};

export const useContractQueryRest = (
  contractAddress: BechAddr32,
  msg: string,
  options: Partial<UseQueryOptions<JsonDataType>>
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<JsonDataType>({
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_QUERY_REST,
      restEndpoint,
      contractAddress,
      msg,
    ],
    queryFn: () => getContractQueryRest(restEndpoint, contractAddress, msg),
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useInstantiatedContractsByAddressRest = (
  address: Option<BechAddr>,
  enabled = false
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.INSTANTIATED_CONTRACTS_BY_ADDRESS_REST,
      restEndpoint,
      address,
    ],
    queryFn: async () => {
      if (!address)
        throw new Error(
          "address not found (getInstantiatedContractsByAddressRest)"
        );
      return getInstantiatedContractsByAddressRest(restEndpoint, address);
    },
    enabled: Boolean(address) && enabled,
    refetchOnWindowFocus: false,
  });
};

export const useContractCw2InfoRest = (
  contractAddress: BechAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.CONTRACT_CW2_INFO_REST,
      restEndpoint,
      contractAddress,
    ],
    queryFn: async () => getContractCw2InfoRest(restEndpoint, contractAddress),
    enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAllAdminContractsByAddress = (address: Option<BechAddr>) => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.ALL_ADMIN_CONTRACTS_BY_ADDRESS,
      endpoint,
      address,
    ],
    queryFn: async () => {
      if (!address)
        throw new Error(
          "Admin address not found (useAllAdminContractsByAddress)"
        );

      return getAllAdminContractsByAddress(endpoint, address);
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAdminsByContractAddresses = (
  contractAddresses: BechAddr32[]
): UseQueryResult<Dict<BechAddr32, BechAddr>> => {
  const endpoint = useBaseApiRoute("contracts");
  return useQuery({
    enabled: contractAddresses.length > 0,
    placeholderData: keepPreviousData,
    queryFn: () => getAdminsByContractAddresses(endpoint, contractAddresses),
    queryKey: [
      CELATONE_QUERY_KEYS.ADMINS_BY_CONTRACTS,
      endpoint,
      contractAddresses,
    ],
  });
};
