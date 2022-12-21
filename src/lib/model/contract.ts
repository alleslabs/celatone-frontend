import type { Coin } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";

import { useApp } from "lib/app-provider";
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
    enable ? address : undefined
  );

  const { getContractInfo } = useContractStore();

  return {
    contracts: contracts.map((contract) => ({
      ...contract,
      ...getContractInfo(contract.address),
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
  const { data: count = 0 } = useInstantiatedCountByUserQuery(address);

  return {
    contracts: Array.from({ length: count }, () => ({
      address: "",
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

export const useContractDetail = (contract: string): ContractDetail => {
  const { getContractInfo } = useContractStore();
  const { chainName, chainId } = useApp();
  const endpoint = useEndpoint();

  const { data: instantiateInfo } = useQuery(
    ["query", "instantiateInfo", contract],
    async () => queryInstantiateInfo(endpoint, contract)
  );
  const { data: contractBalances = { balances: [] } } = useQuery(
    ["query", "contractBalances", contract],
    async () => queryContractBalances(endpoint, contract)
  );
  const { data: publicInfo } = useQuery(
    ["query", "publicInfo", contract],
    async () => queryPublicInfo(chainName, chainId, contract)
  );

  const contractInfo = getContractInfo(contract);
  const {
    data: instantiateDetail = {
      initMsg: "{}",
    },
  } = useInstantiateDetailByContractQuery(contract);
  // TODO: contract proposal id
  const proposalId = undefined;

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
