import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { useCelatoneApp } from "lib/app-provider";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useCodeStore, useContractStore, useLCDEndpoint } from "lib/hooks";
import { useAssetInfos } from "lib/services/assetService";
import type {
  ContractVersionInfo,
  InstantiateInfo,
} from "lib/services/contract";
import {
  queryContractInfo,
  queryContractBalances,
  queryInstantiateInfo,
} from "lib/services/contract";
import {
  useExecuteTxsCountByContractAddress,
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
  BalanceWithAssetInfo,
  ContractAddr,
  Detail,
  HumanAddr,
  Option,
  PublicInfo,
} from "lib/types";
import { formatSlugName } from "lib/utils";

export interface ContractData {
  chainId: string;
  codeInfo: Option<CodeLocalInfo>;
  contractLocalInfo: Option<ContractLocalInfo>;
  contractInfo: Option<ContractVersionInfo>;
  instantiateInfo: Option<InstantiateInfo>;
  publicProject: {
    publicInfo: Option<PublicInfo>;
    publicDetail: Option<Detail>;
  };
  balances: Option<BalanceWithAssetInfo[]>;
  initMsg: string;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
}

export const useInstantiatedByMe = (enable: boolean): ContractListInfo => {
  const { address } = useWallet();
  const { data: contracts = [] } = useInstantiatedListByUserQuery(
    enable ? (address as HumanAddr) : undefined
  );

  const { getContractLocalInfo } = useContractStore();

  return {
    contracts: contracts.map((contract) => ({
      ...contract,
      ...getContractLocalInfo(contract.contractAddress),
    })),
    name: INSTANTIATED_LIST_NAME,
    slug: formatSlugName(INSTANTIATED_LIST_NAME),
    lastUpdated: new Date(),
    isInfoEditable: false,
    isContractRemovable: false,
  };
};

export const useInstantiatedMockInfoByMe = (): ContractListInfo => {
  const { address } = useWallet();
  const { data: count = 0 } = useInstantiatedCountByUserQuery(
    address as HumanAddr
  );

  return {
    contracts: Array.from({ length: count }, () => ({
      contractAddress: "" as ContractAddr,
      instantiator: "",
      label: "",
      created: new Date(0),
    })),
    name: INSTANTIATED_LIST_NAME,
    slug: formatSlugName(INSTANTIATED_LIST_NAME),
    lastUpdated: new Date(),
    isInfoEditable: false,
    isContractRemovable: false,
  };
};

export const useContractData = (
  contractAddress: ContractAddr
): Option<ContractData> => {
  const { indexerGraphClient } = useCelatoneApp();
  const { currentChainRecord } = useWallet();
  const { getCodeLocalInfo } = useCodeStore();
  const { getContractLocalInfo } = useContractStore();
  const endpoint = useLCDEndpoint();
  const assetInfos = useAssetInfos();
  const { data: publicInfo } =
    usePublicProjectByContractAddress(contractAddress);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(publicInfo?.slug);

  const { data: instantiateInfo } = useQuery(
    ["query", "instantiateInfo", endpoint, contractAddress],
    async () =>
      queryInstantiateInfo(endpoint, indexerGraphClient, contractAddress),
    { enabled: !!currentChainRecord }
  );

  const { data: contractInfo } = useQuery(
    ["query", "contractInfo", endpoint, contractAddress],
    async () => queryContractInfo(endpoint, contractAddress),
    { enabled: !!currentChainRecord }
  );

  const { data: contractBalances } = useQuery(
    ["query", "contractBalances", contractAddress],
    async () =>
      queryContractBalances(
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id,
        contractAddress
      ),
    { enabled: !!currentChainRecord }
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

  const {
    data: instantiateDetail = {
      initMsg: "{}",
    },
  } = useInstantiateDetailByContractQuery(contractAddress);

  if (!currentChainRecord) return undefined;

  return {
    chainId: currentChainRecord.chain.chain_id,
    codeInfo,
    contractLocalInfo,
    contractInfo,
    instantiateInfo,
    publicProject: {
      publicInfo,
      publicDetail: publicInfoBySlug?.details,
    },
    balances: contractBalancesWithAssetInfos,
    initMsg: instantiateDetail.initMsg,
    initTxHash: instantiateDetail.initTxHash,
    initProposalId: instantiateDetail.initProposalId,
    initProposalTitle: instantiateDetail.initProposalTitle,
  };
};

export const useContractDetailsTableCounts = (
  contractAddress: ContractAddr
) => {
  const { data: executeCount = 0, refetch: refetchExecute } =
    useExecuteTxsCountByContractAddress(contractAddress);
  const { data: migrationCount = 0, refetch: refetchMigration } =
    useMigrationHistoriesCountByContractAddress(contractAddress);
  const { data: transactionsCount = 0, refetch: refetchTransactions } =
    useTxsCountByContractAddress(contractAddress);

  const { data: relatedProposalsCount = 0, refetch: refetchRelatedProposals } =
    useRelatedProposalsCountByContractAddress(contractAddress);
  return {
    tableCounts: {
      executeCount,
      migrationCount,
      transactionsCount,
      relatedProposalsCount,
    },
    refetchExecute,
    refetchMigration,
    refetchTransactions,
    refetchRelatedProposals,
  };
};
