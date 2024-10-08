import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
  useLcdEndpoint,
  useTierConfig,
} from "lib/app-provider";
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
  getContractCw2InfoLcd,
  getContractLcd,
  getContractQueryLcd,
  getContractQueryMsgsLcd,
  getContractsByCodeIdLcd,
  getInstantiatedContractsByAddressLcd,
  getMigrationHistoriesByContractAddressLcd,
} from "./lcd";

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

export const useMigrationHistoriesByContractAddressLcd = (
  contractAddress: BechAddr32,
  enabled = true
) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_MIGRATION_HISTORIES_BY_CONTRACT_ADDRESS_LCD,
      endpoint,
      contractAddress,
    ],
    async () =>
      getMigrationHistoriesByContractAddressLcd(endpoint, contractAddress),
    {
      retry: 1,
      keepPreviousData: true,
      enabled,
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
      retry: 1,
      refetchOnWindowFocus: false,
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
      retry: 1,
      refetchOnWindowFocus: false,
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
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useContractData = (
  contractAddress: BechAddr32,
  options?: UseQueryOptions<ContractData>
) => {
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("contracts");
  const lcdEndpoint = useLcdEndpoint();
  const endpoint = isFullTier ? apiEndpoint : lcdEndpoint;
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  return useQuery<ContractData>(
    [CELATONE_QUERY_KEYS.CONTRACT_DATA, endpoint, contractAddress, isGov],
    async () =>
      isFullTier
        ? getContractData(endpoint, contractAddress, isGov)
        : getContractLcd(endpoint, contractAddress),
    { retry: 1, refetchOnWindowFocus: false, ...options }
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
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useContractQueryMsgsLcd = (contractAddress: BechAddr32) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_QUERY_MSGS, endpoint, contractAddress],
    async () => getContractQueryMsgsLcd(endpoint, contractAddress),
    {
      enabled: !!contractAddress,
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false,
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
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useContractsByCodeIdLcd = (codeId: number) => {
  const endpoint = useLcdEndpoint();

  return useInfiniteQuery(
    [CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID_LCD, endpoint, codeId],
    ({ pageParam }) => getContractsByCodeIdLcd(endpoint, codeId, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );
};

export const useContractQueryLcd = (
  contractAddress: BechAddr32,
  msg: string,
  options: UseQueryOptions<JsonDataType>
) => {
  const endpoint = useLcdEndpoint();

  return useQuery<JsonDataType>(
    [CELATONE_QUERY_KEYS.CONTRACT_QUERY_LCD, endpoint, contractAddress, msg],
    async () => getContractQueryLcd(endpoint, contractAddress, msg),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useInstantiatedContractsByAddressLcd = (
  address: Option<BechAddr>,
  enabled = false
) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_CONTRACTS_BY_ADDRESS_LCD,
      endpoint,
      address,
    ],
    async () => {
      if (!address)
        throw new Error(
          "address not found (getInstantiatedContractsByAddressLcd)"
        );
      return getInstantiatedContractsByAddressLcd(endpoint, address);
    },
    { enabled: Boolean(address) && enabled, refetchOnWindowFocus: false }
  );
};

export const useContractCw2InfoLcd = (
  contractAddress: BechAddr32,
  enabled = true
) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_CW2_INFO_LCD, endpoint, contractAddress],
    async () => getContractCw2InfoLcd(endpoint, contractAddress),
    { retry: 1, refetchOnWindowFocus: false, enabled }
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
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
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
      keepPreviousData: true,
      enabled: contractAddresses.length > 0,
    }
  );
};
