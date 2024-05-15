import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
  useLcdEndpoint,
} from "lib/app-provider";
import type {
  ContractData,
  ContractLcd,
  ContractsResponse,
  ContractTableCounts,
  MigrationHistoriesResponse,
} from "lib/services/types";
import type { BechAddr, BechAddr32, JsonDataType } from "lib/types";

import {
  getAdminContractsByAddress,
  getContractData,
  getContractQueryMsgs,
  getContracts,
  getContractsByCodeId,
  getContractTableCounts,
  getInstantiatedContractsByAddress,
  getMigrationHistoriesByContractAddress,
} from "./api";
import { getContractLcd, getContractQueryLcd } from "./lcd";

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
  limit: number
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
    }
  );
};

export const useInstantiatedContractsByAddress = (
  address: BechAddr,
  limit: number,
  offset: number
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_CONTRACTS_BY_ADDRESS,
      address,
      limit,
      offset,
    ],
    async () =>
      getInstantiatedContractsByAddress(endpoint, address, limit, offset),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAdminContractsByAddress = (
  address: BechAddr,
  limit: number,
  offset: number
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACTS_BY_ADMIN, address, limit, offset],
    async () => getAdminContractsByAddress(endpoint, address, limit, offset),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useContractData = (contractAddress: BechAddr32) => {
  const endpoint = useBaseApiRoute("contracts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  return useQuery<ContractData>(
    [CELATONE_QUERY_KEYS.CONTRACT_DATA, endpoint, contractAddress, isGov],
    async () => getContractData(endpoint, contractAddress, isGov),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useContractLcd = (
  contractAddress: BechAddr32,
  options?: UseQueryOptions<ContractLcd>
) => {
  const endpoint = useLcdEndpoint();

  return useQuery<ContractLcd>(
    [CELATONE_QUERY_KEYS.CONTRACT_LCD, endpoint, contractAddress],
    async () => getContractLcd(endpoint, contractAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useContractTableCounts = (contractAddress: BechAddr32) => {
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
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useContractQueryMsgs = (contractAddress: BechAddr32) => {
  const endpoint = useBaseApiRoute("contracts");

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACT_QUERY_MSGS, endpoint, contractAddress],
    async () => getContractQueryMsgs(endpoint, contractAddress),
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
    [CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID, endpoint, limit, offset],
    async () => getContractsByCodeId(endpoint, codeId, limit, offset),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
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

export * from "./gql";
