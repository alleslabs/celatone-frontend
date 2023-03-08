import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getAdminByContractAddressesQueryDocument,
  getContractListByAdmin,
  getContractListByAdminPagination,
  getContractListByCodeIdPagination,
  getContractListByWalletAddressPagination,
  getContractListCountByAdmin,
  getContractListCountByCodeId,
  getInstantiatedCountByUserQueryDocument,
  getInstantiateDetailByContractQueryDocument,
  getInstantiatedListByUserQueryDocument,
  getMigrationHistoriesByContractAddressPagination,
  getMigrationHistoriesCountByContractAddress,
} from "lib/query";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  ContractAddr,
  ContractMigrationHistory,
  HumanAddr,
  Option,
  Dict,
  Addr,
  ContractInfo,
} from "lib/types";
import { parseDate, parseTxHashOpt, parseDateOpt } from "lib/utils";

interface InstantiateDetail {
  initMsg: Option<string>;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
}

export const useInstantiatedCountByUserQuery = (
  walletAddr: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

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
    ["instantiated_count_by_user", walletAddr, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddr,
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
    ["instantiated_list_by_user", walletAddr, indexerGraphClient],
    queryFn,
    { enabled: !!walletAddr }
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
    ["contract_list_by_admin", adminAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!adminAddress,
    }
  );
};

export const useInstantiateDetailByContractQuery = (
  contractAddress: ContractAddr
): UseQueryResult<InstantiateDetail> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getInstantiateDetailByContractQueryDocument, { contractAddress })
      .then(({ contracts_by_pk }) => ({
        initMsg: contracts_by_pk?.init_msg,
        initTxHash: parseTxHashOpt(contracts_by_pk?.transaction?.hash),
        initProposalId: contracts_by_pk?.contract_proposals.at(0)?.proposal.id,
        initProposalTitle:
          contracts_by_pk?.contract_proposals.at(0)?.proposal.title,
      }));
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    ["instantiate_detail_by_contract", contractAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useAdminByContractAddresses = (
  contractAddresses: Option<ContractAddr[]>
): UseQueryResult<Dict<ContractAddr, Addr>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!contractAddresses)
      throw new Error("No contract selected (useAdminByContractAddresses)");

    return indexerGraphClient
      .request(getAdminByContractAddressesQueryDocument, {
        contractAddresses,
      })
      .then(({ contracts }) =>
        contracts.reduce<Dict<ContractAddr, Addr>>(
          (prev, contract) => ({
            ...prev,
            [contract.address as ContractAddr]: contract.admin?.address as Addr,
          }),
          {}
        )
      );
  }, [contractAddresses, indexerGraphClient]);

  return useQuery(
    ["admin_by_contracts", contractAddresses, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddresses,
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
      "migration_histories_by_contract_address_pagination",
      contractAddress,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
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
    ["migration_histories_count", contractAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
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
          instantiator: contract.init_by.at(0)?.account.address as Addr,
          label: contract.label,
          admin: contract.admin?.address as Addr,
          latestUpdater: contract.contract_histories.at(0)?.account
            .address as Addr,
          latestUpdated: parseDateOpt(
            contract.contract_histories.at(0)?.block.timestamp
          ),
          remark: contract.contract_histories.at(0)?.remark,
        }))
      );
  }, [codeId, indexerGraphClient, offset, pageSize]);

  return useQuery(
    [
      "contract_list_by_code_id_pagination",
      codeId,
      indexerGraphClient,
      offset,
      pageSize,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!codeId,
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
    ["contract_list_count_by_user", codeId, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!codeId,
    }
  );
};

export const useContractListByWalletAddressPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
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
          instantiator: contractFromWallet.init_by.at(0)?.account
            .address as Addr,
          label: contractFromWallet.label,
          admin: contractFromWallet.admin?.address as Addr,
          latestUpdater: contractFromWallet.contract_histories.at(0)?.account
            .address as Addr,
          latestUpdated: parseDateOpt(
            contractFromWallet.contract_histories.at(0)?.block.timestamp
          ),
          remark: contractFromWallet.contract_histories.at(0)?.remark,
        }))
      );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      "contract_list_by_wallet_address_pagination",
      indexerGraphClient,
      offset,
      pageSize,
      walletAddress,
    ],
    queryFn,
    { enabled: !!walletAddress }
  );
};

export const useContractListByAdminPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
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
          instantiator: contractAdmin.init_by.at(0)?.account.address as Addr,
          label: contractAdmin.label,
          admin: contractAdmin.admin?.address as Addr,
          latestUpdater: contractAdmin.contract_histories.at(0)?.account
            .address as Addr,
          latestUpdated: parseDateOpt(
            contractAdmin.contract_histories.at(0)?.block.timestamp
          ),
          remark: contractAdmin.contract_histories.at(0)?.remark,
        }))
      );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      "contract_list_by_admin_pagination",
      indexerGraphClient,
      offset,
      pageSize,
      walletAddress,
    ],
    queryFn,
    { enabled: !!walletAddress }
  );
};

export const useContractListCountByAdmin = (
  walletAddress: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
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
    ["contract_list_count_by_admin", walletAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddress,
    }
  );
};
