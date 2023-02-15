import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getAdminByContractAddressesQueryDocument,
  getContractListByAdmin,
  getContractListByAdminWithPagination,
  getContractListByCodeId,
  getContractListByWalletAddressWithPagination,
  getContractListCountByAdminWithPagination,
  getContractListCountByCodeId,
  getContractListCountByWalletAddressWithPagination,
  getExecuteTxsByContractAddress,
  getExecuteTxsCountByContractAddress,
  getInstantiatedCountByUserQueryDocument,
  getInstantiateDetailByContractQueryDocument,
  getInstantiatedListByUserQueryDocument,
  getMigrationHistoriesByContractAddress,
  getMigrationHistoriesCountByContractAddress,
  getTxsByContractAddress,
  getTxsCountByContractAddress,
} from "lib/query/contract";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  ContractAddr,
  ContractMigrationHistory,
  ExecuteTransaction,
  AllTransaction,
  HumanAddr,
  Option,
  Dict,
  Addr,
  ContractInfo,
} from "lib/types";
import {
  parseDate,
  getActionMsgType,
  parseTxHash,
  parseTxHashOpt,
  snakeToCamel,
  unwrapAll,
  parseDateOpt,
} from "lib/utils";

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

export const useExecuteTxsByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<ExecuteTransaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getExecuteTxsByContractAddress, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_transactions_view }) =>
        /**
         * @remarks because contract_transactions_view is view table, all fields can be undefined by type
         */
        contract_transactions_view.map((transaction) => ({
          hash: parseTxHash(transaction.hash),
          messages: transaction.messages,
          sender: transaction.sender as Addr,
          height: transaction.height,
          created: parseDateOpt(transaction.timestamp),
          success: transaction.success,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "execute_transactions_by_contract_addr",
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

export const useExecuteTxsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (useExecuteTxsCountByContractAddress)"
      );

    return indexerGraphClient
      .request(getExecuteTxsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_transactions_aggregate }) =>
          contract_transactions_aggregate?.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    [
      "execute_transactions_count_by_contract_addr",
      contractAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useMigrationHistoriesByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Omit<ContractMigrationHistory, "codeName">[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getMigrationHistoriesByContractAddress, {
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
          })
        )
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "migration_histories",
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

export const useTxsByContractAddress = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<AllTransaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getTxsByContractAddress, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_transactions_view }) =>
        /**
         * @remarks because contract_transactions_view is view table, all fields can be undefined by type
         */
        contract_transactions_view.map((contractTx) => ({
          hash: parseTxHash(contractTx.hash),
          messages: snakeToCamel(contractTx.messages),
          sender: contractTx.sender as Addr,
          height: contractTx.height,
          created: parseDateOpt(contractTx.timestamp),
          success: contractTx.success,
          actionMsgType: getActionMsgType([
            /* these value must not be null */
            unwrapAll(contractTx.is_execute),
            unwrapAll(contractTx.is_instantiate),
            unwrapAll(contractTx.is_send),
            unwrapAll(contractTx.is_store_code),
            unwrapAll(contractTx.is_migrate),
            unwrapAll(contractTx.is_update_admin),
            unwrapAll(contractTx.is_clear_admin),
          ]),
          isIbc: contractTx.is_ibc,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "transactions_by_contract_addr",
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

export const useTxsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (useTxsCountByContractAddress)"
      );

    return indexerGraphClient
      .request(getTxsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_transactions_aggregate }) =>
          contract_transactions_aggregate.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    [
      "transactions_count_by_contract_addr",
      contractAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useContractListByCodeId = (
  codeId: Option<number>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!codeId) throw new Error("Code ID not found (useContractListByCodeId)");

    return indexerGraphClient
      .request(getContractListByCodeId, { codeId, offset, pageSize })
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
    ["contract_list_by_code_id", codeId, indexerGraphClient, offset, pageSize],
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

export const useContractListByWalletAddressWithPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useContractListByWalletAddressWithPagination)"
      );
    return (
      indexerGraphClient
        .request(getContractListByWalletAddressWithPagination, {
          walletAddress,
          offset,
          pageSize,
        })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then(({ contracts }) =>
          // eslint-disable-next-line sonarjs/no-identical-functions
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
        )
    );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      "contract_list_by_user_address_pagination",
      indexerGraphClient,
      offset,
      pageSize,
      walletAddress,
    ],
    queryFn,
    { enabled: !!walletAddress }
  );
};

export const useContractListCountByWalletAddressWithPagination = (
  walletAddress: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useContractListCountByWalletAddressWithPagination)"
      );

    return indexerGraphClient
      .request(getContractListCountByWalletAddressWithPagination, {
        walletAddress,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [walletAddress, indexerGraphClient]);

  return useQuery(
    [
      "contract_list_count_by_user_address_pagination",
      walletAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddress,
    }
  );
};

export const useContractListByAdminWithPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useContractListByAdminWithPagination)"
      );
    return indexerGraphClient
      .request(getContractListByAdminWithPagination, {
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

export const useContractListCountByAdminWithPagination = (
  walletAddress: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useContractListCountByAdminWithPagination)"
      );

    return indexerGraphClient
      .request(getContractListCountByAdminWithPagination, {
        walletAddress,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [walletAddress, indexerGraphClient]);

  return useQuery(
    [
      "contract_list_count_by_admin_pagination",
      walletAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddress,
    }
  );
};
