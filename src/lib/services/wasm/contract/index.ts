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

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
  options?: Pick<UseQueryOptions<ContractsResponse>, "onSuccess">
) => {
  const endpoint = useBaseApiRoute("contracts");

  return useQuery<ContractsResponse>(
    [CELATONE_QUERY_KEYS.CONTRACTS, endpoint, limit, offset],
    async () => getContracts(endpoint, limit, offset),
    {
      retry: 1,
      ...options,
    }
  );
};

export const useMigrationHistoriesByContractAddress = (
  contractAddress: BechAddr32,
  offset: number,
  limit: number,
  options?: UseQueryOptions<MigrationHistoriesResponse>
) => {
  const endpoint = useBaseApiRoute("contracts");

  return useQuery<MigrationHistoriesResponse>(
    [
      CELATONE_QUERY_KEYS.CONTRACT_MIGRATION_HISTORIES_BY_CONTRACT_ADDRESS,
      endpoint,
      contractAddress,
      limit,
      offset,
    ],
    async () =>
      getMigrationHistoriesByContractAddress(
        endpoint,
        contractAddress,
        limit,
        offset
      ),
    {
      keepPreviousData: true,
      retry: 1,
      ...options,
    }
  );
};

export const useMigrationHistoriesByContractAddressRest = (
  contractAddress: BechAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_MIGRATION_HISTORIES_BY_CONTRACT_ADDRESS_REST,
      restEndpoint,
      contractAddress,
    ],
    async () =>
      getMigrationHistoriesByContractAddressRest(restEndpoint, contractAddress),
    {
      enabled,
      keepPreviousData: true,
      retry: 1,
    }
  );
};

export const useInstantiatedContractsByAddress = (
  address: Option<BechAddr>,
  limit: number,
  offset: number,
  enabled = true
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_CONTRACTS_BY_ADDRESS,
      endpoint,
      address,
      limit,
      offset,
    ],
    async () => {
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
    {
      enabled: Boolean(address) && enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useAllInstantiatedContractsByAddress = (
  address: Option<BechAddr>,
  enabled = true
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.ALL_INSTANTIATED_CONTRACTS_BY_ADDRESS,
      endpoint,
      address,
    ],
    async () => {
      if (!address)
        throw new Error(
          "address not found (getAllInstantiatedContractsByAddress)"
        );

      return getAllInstantiatedContractsByAddress(endpoint, address);
    },
    {
      enabled: Boolean(address) && enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useAdminContractsByAddress = (
  address: BechAddr,
  limit: number,
  offset: number
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.ADMIN_CONTRACTS_BY_ADDRESS,
      endpoint,
      address,
      limit,
      offset,
    ],
    async () => getAdminContractsByAddress(endpoint, address, limit, offset),
    { refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useContractData = (
  contractAddress: BechAddr32,
  options?: UseQueryOptions<ContractData>
) => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("contracts");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const endpoint = isFullTier ? apiEndpoint : restEndpoint;
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  return useQuery<ContractData>(
    [CELATONE_QUERY_KEYS.CONTRACT_DATA, endpoint, contractAddress, isGov],
    async () =>
      isFullTier
        ? getContractData(endpoint, contractAddress, isGov)
        : getContractRest(endpoint, contractAddress),
    { refetchOnWindowFocus: false, retry: 1, ...options }
  );
};

export const useContractTableCounts = (
  contractAddress: BechAddr32,
  options?: UseQueryOptions<ContractTableCounts>
) => {
  const endpoint = useBaseApiRoute("contracts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  return useQuery<ContractTableCounts>(
    [
      CELATONE_QUERY_KEYS.CONTRACT_TABLE_COUNTS,
      endpoint,
      contractAddress,
      isGov,
    ],
    async () => getContractTableCounts(endpoint, contractAddress, isGov),
    { refetchOnWindowFocus: false, retry: 1, ...options }
  );
};

export const useContractQueryMsgsRest = (contractAddress: BechAddr32) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_QUERY_MSGS, restEndpoint, contractAddress],
    async () => getContractQueryMsgsRest(restEndpoint, contractAddress),
    {
      cacheTime: 0,
      enabled: !!contractAddress,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};

export const useContractsByCodeId = (
  codeId: number,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<ContractsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("codes");

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID, endpoint, codeId, limit, offset],
    async () => getContractsByCodeId(endpoint, codeId, limit, offset),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useContractsByCodeIdRest = (codeId: number) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useInfiniteQuery(
    [CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID_REST, restEndpoint, codeId],
    ({ pageParam }) =>
      getContractsByCodeIdRest(restEndpoint, codeId, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );
};

export const useContractQueryRest = (
  contractAddress: BechAddr32,
  msg: string,
  options: UseQueryOptions<JsonDataType>
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<JsonDataType>(
    [
      CELATONE_QUERY_KEYS.CONTRACT_QUERY_REST,
      restEndpoint,
      contractAddress,
      msg,
    ],
    async () => getContractQueryRest(restEndpoint, contractAddress, msg),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useInstantiatedContractsByAddressRest = (
  address: Option<BechAddr>,
  enabled = false
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_CONTRACTS_BY_ADDRESS_REST,
      restEndpoint,
      address,
    ],
    async () => {
      if (!address)
        throw new Error(
          "address not found (getInstantiatedContractsByAddressRest)"
        );
      return getInstantiatedContractsByAddressRest(restEndpoint, address);
    },
    { enabled: Boolean(address) && enabled, refetchOnWindowFocus: false }
  );
};

export const useContractCw2InfoRest = (
  contractAddress: BechAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_CW2_INFO_REST, restEndpoint, contractAddress],
    async () => getContractCw2InfoRest(restEndpoint, contractAddress),
    { enabled, refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useAllAdminContractsByAddress = (
  address: Option<BechAddr>
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.ALL_ADMIN_CONTRACTS_BY_ADDRESS, endpoint, address],
    async () => {
      if (!address)
        throw new Error(
          "Admin address not found (useAllAdminContractsByAddress)"
        );

      return getAllAdminContractsByAddress(endpoint, address);
    },
    { enabled: !!address, refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useAdminsByContractAddresses = (
  contractAddresses: BechAddr32[]
): UseQueryResult<Dict<BechAddr32, BechAddr>> => {
  const endpoint = useBaseApiRoute("contracts");
  return useQuery(
    [CELATONE_QUERY_KEYS.ADMINS_BY_CONTRACTS, endpoint, contractAddresses],
    () => getAdminsByContractAddresses(endpoint, contractAddresses),
    {
      enabled: contractAddresses.length > 0,
      keepPreviousData: true,
    }
  );
};
