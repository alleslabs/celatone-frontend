import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
  useWasmConfig,
} from "lib/app-provider";
import {
  getAdminByContractAddressesQueryDocument,
  getContractByContractAddressQueryDocument,
  getContractListByAdmin,
  getInstantiatedCountByUserQueryDocument,
  getInstantiatedListByUserQueryDocument,
} from "lib/query";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { BechAddr, BechAddr20, BechAddr32, Dict, Option } from "lib/types";

import {
  getAdminContractsByAddress,
  getContractDataByContractAddress,
  getContractQueryMsgs,
  getContracts,
  getContractsByCodeId,
  getContractTableCounts,
  getInstantiatedContractsByAddress,
  getMigrationHistoriesByContractAddress,
} from "./contract";
import type {
  ContractData,
  ContractsResponse,
  ContractTableCounts,
  MigrationHistoriesResponse,
} from "./contract";
import { getCodeIdInfoLcd } from "./wasm/code/lcd";

export interface ContractDetail extends ContractLocalInfo {
  codeId: number;
  codeHash: string;
  admin: Option<BechAddr>;
}

export const useContractDetailByContractAddress = (
  contractAddress: BechAddr32,
  onSuccess?: (data: ContractDetail) => void,
  onError?: (err: Error) => void
): UseQueryResult<ContractDetail> => {
  const { indexerGraphClient } = useCelatoneApp();
  const lcdEndpoint = useBaseApiRoute("rest");

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getContractByContractAddressQueryDocument, { contractAddress })
      .then<ContractDetail>(async ({ contracts_by_pk }) => {
        if (!contracts_by_pk) throw Error("Contract not found");
        // TODO: retrieve code hash from gql instead when available
        const codeHash = await getCodeIdInfoLcd(
          lcdEndpoint,
          contracts_by_pk.code_id
        ).then((data) => data.codeInfo.dataHash);
        return {
          contractAddress,
          codeId: contracts_by_pk.code_id,
          codeHash,
          label: contracts_by_pk.label,
          instantiator: contracts_by_pk.accountByInitBy?.address as BechAddr,
          admin: contracts_by_pk.admin
            ? (contracts_by_pk.admin.address as BechAddr)
            : undefined,
        };
      });
  }, [contractAddress, lcdEndpoint, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_DETAIL_BY_CONTRACT_ADDRESS,
      contractAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(contractAddress),
      onSuccess,
      onError,
    }
  );
};

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

export const useInstantiatedCountByUserQuery = (
  walletAddr: Option<BechAddr20>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error(
        "Wallet address not found (useInstantiatedCountByUserQuery)"
      );

    return indexerGraphClient
      .request(getInstantiatedCountByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [indexerGraphClient, walletAddr]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_COUNT_BY_WALLET_ADDRESS,
      walletAddr,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: wasm.enabled && Boolean(walletAddr),
    }
  );
};

export const useInstantiatedListByUserQuery = (
  walletAddr: Option<BechAddr20>
): UseQueryResult<ContractLocalInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error(
        "Wallet address not found (useInstantiatedListByUserQuery)"
      );

    return indexerGraphClient
      .request(getInstantiatedListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts }) =>
        contracts.map<ContractLocalInfo>((contractInst) => ({
          contractAddress: contractInst.address as BechAddr32,
          instantiator: contractInst.accountByInitBy?.address as BechAddr,
          label: contractInst.label,
        }))
      );
  }, [indexerGraphClient, walletAddr]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_LIST_BY_WALLET_ADDRESS,
      walletAddr,
      indexerGraphClient,
    ],
    queryFn,
    { enabled: Boolean(walletAddr), refetchOnWindowFocus: false }
  );
};

export const useContractListByAdmin = (
  adminAddress: Option<BechAddr>
): UseQueryResult<ContractLocalInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!adminAddress)
      throw new Error("Admin address not found (useContractListByAdmin)");

    return indexerGraphClient
      .request(getContractListByAdmin, {
        address: adminAddress,
      })
      .then(({ contracts }) =>
        contracts.map<ContractLocalInfo>((contractAdmin) => ({
          contractAddress: contractAdmin.address as BechAddr32,
          instantiator: contractAdmin.accountByInitBy?.address as BechAddr,
          label: contractAdmin.label,
        }))
      );
  }, [adminAddress, indexerGraphClient]);

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACTS_BY_ADMIN, adminAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: Boolean(adminAddress),
    }
  );
};

export const useAdminByContractAddresses = (
  contractAddresses: BechAddr32[]
): UseQueryResult<Dict<BechAddr32, BechAddr>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getAdminByContractAddressesQueryDocument, {
          contractAddresses,
        })
        .then(({ contracts }) =>
          contracts.reduce<Dict<BechAddr32, BechAddr>>(
            (prev, contract) => ({
              ...prev,
              [contract.address as BechAddr32]: contract.admin
                ?.address as BechAddr,
            }),
            {}
          )
        ),
    [contractAddresses, indexerGraphClient]
  );

  return useQuery(
    [
      CELATONE_QUERY_KEYS.ADMINS_BY_CONTRACTS,
      contractAddresses,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: contractAddresses.length > 0,
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

export const useContractDataByContractAddress = (
  contractAddress: BechAddr32
) => {
  const endpoint = useBaseApiRoute("contracts");
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  return useQuery<ContractData>(
    [CELATONE_QUERY_KEYS.CONTRACT_DATA, endpoint, contractAddress, isGov],
    async () =>
      getContractDataByContractAddress(endpoint, contractAddress, isGov),
    { retry: 1, refetchOnWindowFocus: false }
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
