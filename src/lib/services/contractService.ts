import type { UseQueryResult } from "@tanstack/react-query";
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
  getContractListByAdminPagination,
  getContractListByCodeIdPagination,
  getContractListByWalletAddressPagination,
  getContractListCountByAdmin,
  getContractListCountByCodeId,
  getContractListQueryDocument,
  getInstantiatedCountByUserQueryDocument,
  getInstantiateDetailByContractQueryDocument,
  getInstantiatedListByUserQueryDocument,
  getMigrationHistoriesByContractAddressPagination,
  getMigrationHistoriesCountByContractAddress,
} from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  ContractAddr,
  ContractMigrationHistory,
  HumanAddr,
  Option,
  Dict,
  Addr,
  ContractInfo,
  Nullable,
} from "lib/types";
import { parseDate, parseTxHashOpt, parseDateOpt } from "lib/utils";

import { getCodeIdInfo } from "./code";
import {
  type ContractsResponse,
  getAdminContractsByAddress,
  getInstantiatedContractsByAddress,
} from "./contract";

export interface ContractDetail extends ContractLocalInfo {
  codeId: number;
  codeHash: string;
  admin: Option<Addr>;
}

interface InstantiateDetail {
  createdHeight: Option<number>;
  createdTime: Option<Date>;
  initMsg: Option<Nullable<string>>;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
}

export const useContractDetailByContractAddress = (
  contractAddress: ContractAddr,
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
        const codeHash = await getCodeIdInfo(
          lcdEndpoint,
          String(contracts_by_pk.code_id)
        ).then((data) => data.code_info.data_hash);
        return {
          contractAddress,
          codeId: contracts_by_pk.code_id,
          codeHash,
          label: contracts_by_pk.label,
          instantiator: contracts_by_pk.accountByInitBy?.address as Addr,
          admin: contracts_by_pk.admin
            ? (contracts_by_pk.admin.address as Addr)
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

export const useInstantiateDetailByContractQuery = (
  contractAddress: ContractAddr
): UseQueryResult<InstantiateDetail> => {
  const { indexerGraphClient } = useCelatoneApp();
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getInstantiateDetailByContractQueryDocument, {
        contractAddress,
        isGov,
      })
      .then<InstantiateDetail>(({ contracts_by_pk }) => ({
        createdHeight: contracts_by_pk?.contract_histories?.[0]?.block.height,
        createdTime: parseDateOpt(
          contracts_by_pk?.contract_histories?.[0]?.block.timestamp
        ),
        initMsg: contracts_by_pk?.init_msg,
        initTxHash: parseTxHashOpt(contracts_by_pk?.transaction?.hash),
        initProposalId: contracts_by_pk?.contract_proposals?.[0]?.proposal.id,
        initProposalTitle:
          contracts_by_pk?.contract_proposals?.[0]?.proposal.title,
      }));
  }, [contractAddress, indexerGraphClient, isGov]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_INSTANTIATE_DETAIL,
      contractAddress,
      indexerGraphClient,
      isGov,
    ],
    queryFn,
    {
      enabled: Boolean(contractAddress),
    }
  );
};

export const useContractListQuery = (): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getContractListQueryDocument)
        .then(({ contracts }) =>
          contracts.map<ContractInfo>((contract) => ({
            contractAddress: contract.address as ContractAddr,
            instantiator: contract.init_by[0]?.account.address as Addr,
            label: contract.label,
            admin: contract.admin?.address as Addr,
            latestUpdater: undefined,
            latestUpdated: parseDateOpt(contract.init_by[0]?.block.timestamp),
            remark: undefined,
          }))
        ),
    [indexerGraphClient]
  );

  return useQuery([CELATONE_QUERY_KEYS.CONTRACTS, indexerGraphClient], queryFn);
};

export const useInstantiatedCountByUserQuery = (
  walletAddr: Option<HumanAddr>
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
  walletAddr: Option<HumanAddr>
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
          contractAddress: contractInst.address as ContractAddr,
          instantiator: contractInst.accountByInitBy?.address as Addr,
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
  adminAddress: Addr
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
          contractAddress: contractAdmin.address as ContractAddr,
          instantiator: contractAdmin.accountByInitBy?.address as Addr,
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
  contractAddresses: ContractAddr[]
): UseQueryResult<Dict<ContractAddr, Addr>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getAdminByContractAddressesQueryDocument, {
          contractAddresses,
        })
        .then(({ contracts }) =>
          contracts.reduce<Dict<ContractAddr, Addr>>(
            (prev, contract) => ({
              ...prev,
              [contract.address as ContractAddr]: contract.admin
                ?.address as Addr,
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

export const useMigrationHistoriesByContractAddressPagination = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Omit<ContractMigrationHistory, "codeName">[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getMigrationHistoriesByContractAddressPagination, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_histories }) =>
        contract_histories.map<Omit<ContractMigrationHistory, "codeName">>(
          (history) => ({
            codeId: history.code_id,
            sender: history.account.address as Addr,
            height: history.block.height,
            timestamp: parseDate(history.block.timestamp),
            remark: history.remark,
            uploader: history.code.account.address as Addr,
            cw2Contract: history.code.cw2_contract,
            cw2Version: history.code.cw2_version,
          })
        )
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_MIGRATION_HISTORIES_PAGINATION,
      contractAddress,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: Boolean(contractAddress),
    }
  );
};

export const useMigrationHistoriesCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getMigrationHistoriesCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_histories_aggregate }) =>
          contract_histories_aggregate.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACT_MIGRATION_HISTORIES_COUNT,
      contractAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: Boolean(contractAddress),
    }
  );
};

export const useContractListByCodeIdPagination = (
  codeId: Option<number>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!codeId) throw new Error("Code ID not found (useContractListByCodeId)");

    return indexerGraphClient
      .request(getContractListByCodeIdPagination, { codeId, offset, pageSize })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: contract.init_by[0]?.account.address as Addr,
          label: contract.label,
          admin: contract.admin?.address as Addr,
          latestUpdater: contract.contract_histories[0]?.account
            .address as Addr,
          latestUpdated: parseDateOpt(
            contract.contract_histories[0]?.block.timestamp
          ),
          remark: contract.contract_histories[0]?.remark,
        }))
      );
  }, [codeId, indexerGraphClient, offset, pageSize]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID_PAGINATION,
      codeId,
      indexerGraphClient,
      offset,
      pageSize,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: Boolean(codeId),
    }
  );
};

export const useContractListCountByCodeId = (
  codeId: Option<number>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!codeId)
      throw new Error("Code ID not found (useContractListCountByCodeId)");

    return indexerGraphClient
      .request(getContractListCountByCodeId, {
        codeId,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [codeId, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACTS_BY_CODE_ID_COUNT,
      codeId,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: Boolean(codeId),
    }
  );
};

export const useInstantiatedContractsByAddress = (
  address: Addr,
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

export const useContractListByWalletAddressPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useContractListByWalletAddressPagination)"
      );
    return indexerGraphClient
      .request(getContractListByWalletAddressPagination, {
        walletAddress,
        offset,
        pageSize,
      })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contractFromWallet) => ({
          contractAddress: contractFromWallet.address as ContractAddr,
          instantiator: contractFromWallet.init_by[0]?.account.address as Addr,
          label: contractFromWallet.label,
          admin: contractFromWallet.admin?.address as Addr,
          latestUpdater: contractFromWallet.contract_histories[0]?.account
            .address as Addr,
          latestUpdated: parseDateOpt(
            contractFromWallet.contract_histories[0]?.block.timestamp
          ),
          remark: contractFromWallet.contract_histories[0]?.remark,
        }))
      );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACTS_BY_INIT_WALLET_ADDRESS,
      indexerGraphClient,
      offset,
      pageSize,
      walletAddress,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      enabled: wasm.enabled && Boolean(walletAddress),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useAdminContractsByAddress = (
  address: Addr,
  limit: number,
  offset: number
): UseQueryResult<ContractsResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.ADMIN_CONTRACTS_BY_ADDRESS, address, limit, offset],
    async () => getAdminContractsByAddress(endpoint, address, limit, offset),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useContractListByAdminPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useContractListByAdminPagination)"
      );
    return indexerGraphClient
      .request(getContractListByAdminPagination, {
        walletAddress,
        offset,
        pageSize,
      })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contractAdmin) => ({
          contractAddress: contractAdmin.address as ContractAddr,
          instantiator: contractAdmin.init_by[0]?.account.address as Addr,
          label: contractAdmin.label,
          admin: contractAdmin.admin?.address as Addr,
          latestUpdater: contractAdmin.contract_histories[0]?.account
            .address as Addr,
          latestUpdated: parseDateOpt(
            contractAdmin.contract_histories[0]?.block.timestamp
          ),
          remark: contractAdmin.contract_histories[0]?.remark,
        }))
      );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACTS_BY_ADMIN_PAGINATION,
      indexerGraphClient,
      offset,
      pageSize,
      walletAddress,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      enabled: wasm.enabled && Boolean(walletAddress),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useContractListCountByAdmin = (
  walletAddress: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error("Wallet address not found (useContractListCountByAdmin)");

    return indexerGraphClient
      .request(getContractListCountByAdmin, {
        walletAddress,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [walletAddress, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CONTRACTS_BY_ADMIN_COUNT,
      walletAddress,
      indexerGraphClient,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      keepPreviousData: true,
      enabled: wasm.enabled && Boolean(walletAddress),
    }
  );
};
