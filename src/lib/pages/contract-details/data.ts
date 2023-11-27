import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
} from "lib/app-provider";
import { useCodeStore, useContractStore } from "lib/providers/store";
import { useAssetInfos } from "lib/services/assetService";
import { useBalances } from "lib/services/balanceService";
import { queryContract, queryContractCw2Info } from "lib/services/contract";
import {
  useContractDetailByContractAddress,
  useInstantiateDetailByContractQuery,
  useMigrationHistoriesByContractAddressPagination,
} from "lib/services/contractService";
import {
  usePublicProjectByContractAddress,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type {
  ContractAddr,
  ContractMigrationHistory,
  Option,
  TokenWithValue,
} from "lib/types";
import { coinToTokenWithValue, compareTokenWithValues } from "lib/utils";

import type { ContractData } from "./types";

export const useContractData = (
  contractAddress: ContractAddr
): ContractData => {
  const { currentChainId } = useCelatoneApp();
  const { getCodeLocalInfo } = useCodeStore();
  const { getContractLocalInfo } = useContractStore();
  const lcdEndpoint = useBaseApiRoute("rest");

  const { data: contractDetail, isLoading: isContractDetailLoading } =
    useContractDetailByContractAddress(contractAddress);

  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: true,
  });
  const { data: contractBalances, isLoading: isContractBalancesLoading } =
    useBalances(contractAddress);
  const balances = contractBalances
    ?.map(
      ({ denom, amount }): TokenWithValue =>
        coinToTokenWithValue(denom, amount, assetInfos)
    )
    .sort(compareTokenWithValues);

  const { data: publicInfo } =
    usePublicProjectByContractAddress(contractAddress);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(publicInfo?.slug);

  const { data: contractCw2Info, isLoading: isContractCw2InfoLoading } =
    useQuery(
      [CELATONE_QUERY_KEYS.CONTRACT_CW2_INFO, lcdEndpoint, contractAddress],
      async () => queryContractCw2Info(lcdEndpoint, contractAddress),
      { enabled: Boolean(contractAddress), retry: false }
    );

  const codeLocalInfo = contractDetail
    ? getCodeLocalInfo(Number(contractDetail.codeId))
    : undefined;
  const contractLocalInfo = getContractLocalInfo(contractAddress);

  const { data: instantiateDetail, isLoading: isInstantiateDetailLoading } =
    useInstantiateDetailByContractQuery(contractAddress);

  const { data: rawContractResponse, isLoading: isRawContractResponseLoading } =
    useQuery(
      [CELATONE_QUERY_KEYS.CONTRACT_INFO, lcdEndpoint, contractAddress],
      async () => queryContract(lcdEndpoint, contractAddress),
      { enabled: Boolean(contractAddress), retry: false }
    );

  return {
    chainId: currentChainId,
    codeLocalInfo,
    contractLocalInfo,
    contractDetail,
    isContractDetailLoading,
    publicProject: {
      publicInfo,
      publicDetail: publicInfoBySlug?.details,
    },
    balances,
    isBalancesLoading: isAssetInfosLoading || isContractBalancesLoading,
    contractCw2Info,
    isContractCw2InfoLoading,
    initMsg: instantiateDetail?.initMsg,
    initTxHash: instantiateDetail?.initTxHash,
    initProposalId: instantiateDetail?.initProposalId,
    initProposalTitle: instantiateDetail?.initProposalTitle,
    createdHeight: instantiateDetail?.createdHeight,
    createdTime: instantiateDetail?.createdTime,
    isInstantiateDetailLoading,
    rawContractResponse,
    isRawContractResponseLoading,
  };
};

export const useMigrationHistories = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): Option<ContractMigrationHistory[]> => {
  const { data: migrationData } =
    useMigrationHistoriesByContractAddressPagination(
      contractAddress,
      offset,
      pageSize
    );
  const { getCodeLocalInfo } = useCodeStore();

  if (!migrationData) return undefined;

  return migrationData.map<ContractMigrationHistory>((data) => {
    const localInfo = getCodeLocalInfo(data.codeId);
    return {
      ...data,
      codeName: localInfo?.name,
    };
  });
};
