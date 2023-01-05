import type { Coin } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useCodeStore, useContractStore, useEndpoint } from "lib/hooks";
import type { InstantiateInfo, PublicInfo } from "lib/services/contract";
import {
  queryPublicInfo,
  queryContractBalances,
  queryInstantiateInfo,
} from "lib/services/contract";
import {
  useExecuteTransactionsCountFromContractAddress,
  useExecuteTransactionsFromContractAddress,
  useInstantiatedCountByUserQuery,
  useInstantiateDetailByContractQuery,
  useInstantiatedListByUserQuery,
} from "lib/services/contractService";
import type { CodeLocalInfo } from "lib/stores/code";
import type { ContractInfo, ContractListInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr } from "lib/types";
import { formatSlugName } from "lib/utils";

export interface ContractDetail {
  chainId: string;
  codeInfo: CodeLocalInfo | undefined;
  contractInfo: ContractInfo | undefined;
  instantiateInfo: InstantiateInfo | undefined;
  publicInfo: PublicInfo | undefined;
  balances: Coin[];
  initMsg: string;
  initTxHash: string | undefined;
  initProposalTitle: string | undefined;
  initProposalId: number | undefined;
}

export const useInstantiatedByMe = (enable: boolean): ContractListInfo => {
  const { address } = useWallet();
  const { data: contracts = [] } = useInstantiatedListByUserQuery(
    enable ? (address as HumanAddr) : undefined
  );

  const { getContractInfo } = useContractStore();

  return {
    contracts: contracts.map((contract) => ({
      ...contract,
      ...getContractInfo(contract.contractAddress),
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

export const useContractDetail = (
  contractAddress: ContractAddr
): ContractDetail | undefined => {
  const { currentChainRecord } = useWallet();
  const { getCodeLocalInfo } = useCodeStore();
  const { getContractInfo } = useContractStore();
  const endpoint = useEndpoint();

  const { data: instantiateInfo } = useQuery(
    ["query", "instantiateInfo", contractAddress],
    async () => queryInstantiateInfo(endpoint, contractAddress),
    { enabled: !!currentChainRecord }
  );
  const { data: contractBalances = { balances: [] } } = useQuery(
    ["query", "contractBalances", contractAddress],
    async () => queryContractBalances(endpoint, contractAddress),
    { enabled: !!currentChainRecord }
  );
  const { data: publicInfo } = useQuery(
    ["query", "publicInfo", contractAddress],
    async () =>
      queryPublicInfo(
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id,
        contractAddress
      ),
    { enabled: !!currentChainRecord }
  );

  const codeInfo = instantiateInfo
    ? getCodeLocalInfo(Number(instantiateInfo.codeId))
    : undefined;
  const contractInfo = getContractInfo(contractAddress);

  const {
    data: instantiateDetail = {
      initMsg: "{}",
    },
  } = useInstantiateDetailByContractQuery(contractAddress);
  // TODO: contract proposal title and id
  const initProposalTitle = undefined;
  const initProposalId = undefined;
  // TODO: get all related transactions

  if (!currentChainRecord) return undefined;

  return {
    chainId: currentChainRecord.chain.chain_id,
    codeInfo,
    contractInfo,
    instantiateInfo,
    publicInfo,
    balances: contractBalances.balances,
    initMsg: instantiateDetail.initMsg,
    initTxHash: instantiateDetail.initTxHash,
    initProposalTitle,
    initProposalId,
  };
};

export const useExecuteTransactions = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
) => {
  const { data: executeTransaction, refetch } =
    useExecuteTransactionsFromContractAddress(
      contractAddress,
      offset,
      pageSize
    );
  const { data: count = 0 } =
    useExecuteTransactionsCountFromContractAddress(contractAddress);

  return {
    executeTransaction,
    count,
    refetch,
  };
};
