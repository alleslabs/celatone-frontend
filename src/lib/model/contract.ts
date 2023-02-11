import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { useCelatoneApp } from "lib/app-provider";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import {
  useChainId,
  useCodeStore,
  useContractStore,
  useLCDEndpoint,
} from "lib/hooks";
import { useAssetInfos } from "lib/services/assetService";
import type { ContractCw2Info, InstantiateInfo } from "lib/services/contract";
import {
  queryContractCw2Info,
  queryContractBalances,
  queryInstantiateInfo,
} from "lib/services/contract";
import {
  useInstantiatedCountByUserQuery,
  useInstantiateDetailByContractQuery,
  useInstantiatedListByUserQuery,
  useMigrationHistoriesCountByContractAddress,
  useTxsCountByContractAddress,
  useRelatedProposalsCountByContractAddress,
} from "lib/services/contractService";
import {
  usePublicProjectByContractAddress,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type { CodeLocalInfo } from "lib/stores/code";
import type { ContractLocalInfo, ContractListInfo } from "lib/stores/contract";
import type {
  Addr,
  BalanceWithAssetInfo,
  ContractAddr,
  PublicDetail,
  HumanAddr,
  Option,
  PublicInfo,
} from "lib/types";
import { formatSlugName, getCurrentDate, getDefaultDate } from "lib/utils";

export interface ContractDataState {
  contractData: {
    chainId: string;
    codeInfo: Option<CodeLocalInfo>;
    contractLocalInfo: Option<ContractLocalInfo>;
    contractCw2Info: Option<ContractCw2Info>;
    instantiateInfo: Option<InstantiateInfo>;
    publicProject: {
      publicInfo: Option<PublicInfo>;
      publicDetail: Option<PublicDetail>;
    };
    balances: Option<BalanceWithAssetInfo[]>;
    initMsg: Option<string>;
    initTxHash: Option<string>;
    initProposalId: Option<number>;
    initProposalTitle: Option<string>;
  };
  isLoading: boolean;
}

interface InstantiatedByMeState {
  instantiatedListInfo: ContractListInfo;
  isLoading: boolean;
}

export const useInstantiatedByMe = (enable: boolean): InstantiatedByMeState => {
  const { address } = useWallet();
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
  const { address } = useWallet();
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

export const useContractData = (
  contractAddress: ContractAddr
): Option<ContractDataState> => {
  const { indexerGraphClient } = useCelatoneApp();
  const { currentChainRecord } = useWallet();
  const { getCodeLocalInfo } = useCodeStore();
  const { getContractLocalInfo } = useContractStore();
  const endpoint = useLCDEndpoint();
  const assetInfos = useAssetInfos();
  const { data: publicInfo } =
    usePublicProjectByContractAddress(contractAddress);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(publicInfo?.slug);
  const chainId = useChainId();

  const { data: instantiateInfo, isLoading: isInstantiateInfoLoading } =
    useQuery(
      ["query", "instantiate_info", endpoint, contractAddress],
      async () =>
        queryInstantiateInfo(endpoint, indexerGraphClient, contractAddress),
      { enabled: !!currentChainRecord, retry: false }
    );

  const { data: contractCw2Info, isLoading: isContractCw2InfoLoading } =
    useQuery(
      ["query", "contract_cw2_info", endpoint, contractAddress],
      async () => queryContractCw2Info(endpoint, contractAddress),
      { enabled: !!currentChainRecord, retry: false }
    );

  const { data: contractBalances, isLoading: isContractBalancesLoading } =
    useQuery(
      ["query", "contractBalances", contractAddress, chainId],
      async () =>
        queryContractBalances(
          currentChainRecord?.name,
          currentChainRecord?.chain.chain_id,
          contractAddress
        ),
      { enabled: !!currentChainRecord, retry: false }
    );

  const contractBalancesWithAssetInfos = contractBalances
    ?.map(
      (balance): BalanceWithAssetInfo => ({
        balance,
        assetInfo: assetInfos?.[balance.id],
      })
    )
    .sort((a, b) => {
      if (a.balance.symbol && b.balance.symbol) {
        return a.balance.symbol.localeCompare(b.balance.symbol);
      }
      return -1;
    });

  const codeInfo = instantiateInfo
    ? getCodeLocalInfo(Number(instantiateInfo.codeId))
    : undefined;
  const contractLocalInfo = getContractLocalInfo(contractAddress);

  const { data: instantiateDetail } =
    useInstantiateDetailByContractQuery(contractAddress);

  if (!currentChainRecord) return undefined;

  return {
    contractData: {
      chainId: currentChainRecord.chain.chain_id,
      codeInfo,
      contractLocalInfo,
      contractCw2Info,
      instantiateInfo,
      publicProject: {
        publicInfo,
        publicDetail: publicInfoBySlug?.details,
      },
      balances: contractBalancesWithAssetInfos,
      initMsg: instantiateDetail?.initMsg,
      initTxHash: instantiateDetail?.initTxHash,
      initProposalId: instantiateDetail?.initProposalId,
      initProposalTitle: instantiateDetail?.initProposalTitle,
    },
    isLoading:
      isInstantiateInfoLoading &&
      isContractCw2InfoLoading &&
      isContractBalancesLoading,
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
  // const { data: executeCount, refetch: refetchExecute } =
  //   useExecuteTxsCountByContractAddress(contractAddress);
  const { data: migrationCount, refetch: refetchMigration } =
    useMigrationHistoriesCountByContractAddress(contractAddress);
  const { data: transactionsCount, refetch: refetchTransactions } =
    useTxsCountByContractAddress(contractAddress);
  const { data: relatedProposalsCount, refetch: refetchRelatedProposals } =
    useRelatedProposalsCountByContractAddress(contractAddress);

  return {
    tableCounts: {
      // executeCount,
      migrationCount,
      transactionsCount,
      relatedProposalsCount,
    },
    // refetchExecute,
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  };
};
