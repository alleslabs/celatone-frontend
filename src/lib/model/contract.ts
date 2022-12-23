import type { Coin } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore, useEndpoint } from "lib/hooks";
import type { InstantiateInfo, PublicInfo } from "lib/services/contract";
import {
  queryPublicInfo,
  queryContractBalances,
  queryInstantiateInfo,
} from "lib/services/contract";
import {
  useInstantiatedCountByUserQuery,
  useInstantiateDetailByContractQuery,
  useInstantiatedListByUserQuery,
} from "lib/services/contractService";
import type { ContractInfo, ContractListInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr } from "lib/types";
import { formatSlugName } from "lib/utils";

interface ContractDetail {
  instantiateInfo: InstantiateInfo | undefined;
  contractInfo: ContractInfo | undefined;
  publicInfo: PublicInfo | undefined;
  balances: Coin[];
  initMsg: string;
  initTxHash?: string;
  initProposalId?: number;
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

  const contractInfo = getContractInfo(contractAddress);
  const {
    data: instantiateDetail = {
      initMsg: "{}",
    },
  } = useInstantiateDetailByContractQuery(contractAddress);
  // TODO: contract proposal id
  const proposalId = undefined;
  // TODO: get all related transactions

  if (!currentChainRecord) return undefined;

  return {
    instantiateInfo,
    contractInfo,
    publicInfo,
    balances: contractBalances.balances,
    initMsg: instantiateDetail.initMsg,
    initTxHash: instantiateDetail.initTxHash,
    initProposalId: proposalId,
  };
};
