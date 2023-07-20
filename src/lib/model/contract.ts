import { useCurrentChain } from "lib/app-provider";
import { DEFAULT_TX_FILTERS, INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/providers/store";
import {} from "lib/services/contract";
import {
  useContractListByCodeIdPagination,
  useInstantiatedCountByUserQuery,
  useInstantiatedListByUserQuery,
  useMigrationHistoriesCountByContractAddress,
} from "lib/services/contractService";
import { useRelatedProposalsCountByContractAddress } from "lib/services/proposalService";
import { useTxsCountByAddress } from "lib/services/txService";
import type { ContractListInfo } from "lib/stores/contract";
import type {
  Addr,
  ContractAddr,
  HumanAddr,
  ContractInfo,
  Option,
} from "lib/types";
import { formatSlugName, getCurrentDate, getDefaultDate } from "lib/utils";

interface InstantiatedByMeState {
  instantiatedListInfo: ContractListInfo;
  isLoading: boolean;
}

export const useInstantiatedByMe = (enable: boolean): InstantiatedByMeState => {
  const { address } = useCurrentChain();
  const { data: contracts = [], isLoading } = useInstantiatedListByUserQuery(
    enable ? (address as HumanAddr) : undefined
  );

  const { getContractLocalInfo } = useContractStore();

  return {
    instantiatedListInfo: {
      contracts: contracts.map((contract) => ({
        ...contract,
        ...getContractLocalInfo(contract.contractAddress),
      })),
      name: INSTANTIATED_LIST_NAME,
      slug: formatSlugName(INSTANTIATED_LIST_NAME),
      lastUpdated: getCurrentDate(),
      isInfoEditable: false,
      isContractRemovable: false,
    },
    isLoading,
  };
};

export const useInstantiatedMockInfoByMe = (): ContractListInfo => {
  const { address } = useCurrentChain();
  const { data: count } = useInstantiatedCountByUserQuery(address as HumanAddr);

  return {
    contracts: Array.from({ length: count ?? 0 }, () => ({
      contractAddress: "" as ContractAddr,
      instantiator: "" as Addr,
      label: "",
      created: getDefaultDate(),
    })),
    name: INSTANTIATED_LIST_NAME,
    slug: formatSlugName(INSTANTIATED_LIST_NAME),
    lastUpdated: getCurrentDate(),
    isInfoEditable: false,
    isContractRemovable: false,
  };
};

/**
 * @remark
 * Remove execute table for now
 *
 */
export const useContractDetailsTableCounts = (
  contractAddress: ContractAddr
) => {
  const { data: migrationCount, refetch: refetchMigration } =
    useMigrationHistoriesCountByContractAddress(contractAddress);
  const { data: transactionsCount, refetch: refetchTransactions } =
    useTxsCountByAddress({
      address: contractAddress,
      accountId: undefined,
      search: "",
      filters: DEFAULT_TX_FILTERS,
      isSigner: undefined,
    });
  const { data: relatedProposalsCount, refetch: refetchRelatedProposals } =
    useRelatedProposalsCountByContractAddress(contractAddress);

  return {
    tableCounts: {
      migrationCount,
      transactionsCount,
      relatedProposalsCount,
    },
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  };
};

export const useContractsByCodeId = (
  codeId: number,
  offset: number,
  pageSize: number
) => {
  const { getContractLocalInfo } = useContractStore();
  const { data: rawCodeContracts, isLoading } =
    useContractListByCodeIdPagination(codeId, offset, pageSize);
  const contracts: Option<ContractInfo[]> = rawCodeContracts?.map<ContractInfo>(
    (contract) => ({
      ...contract,
      ...getContractLocalInfo(contract.contractAddress),
    })
  );

  return { contracts, isLoading };
};
