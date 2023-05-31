import { useMemo } from "react";

import { useContractStore } from "lib/providers/store";
import { useContractListQuery } from "lib/services/contractService";
import type { ContractInfo } from "lib/types";

interface RecentContractsData {
  recentContracts: ContractInfo[];
  isLoading: boolean;
}

const searchFilterFn = (keyword: string) => (contract: ContractInfo) => {
  const computedKeyword = keyword.trim();
  if (!computedKeyword.length) return true;
  return (
    contract.contractAddress.startsWith(computedKeyword) ||
    contract.name?.toLowerCase().includes(computedKeyword.toLowerCase()) ||
    contract.label.toLowerCase().includes(computedKeyword.toLowerCase())
  );
};

export const useRecentContractsData = (
  keyword: string
): RecentContractsData => {
  const { getContractLocalInfo } = useContractStore();
  const { data: rawRecentContracts = [], isLoading } = useContractListQuery();

  const recentContracts = rawRecentContracts.map<ContractInfo>((contract) => {
    const contractLocalInfo = getContractLocalInfo(contract.contractAddress);
    return {
      ...contract,
      name: contractLocalInfo?.name,
      description: contractLocalInfo?.description,
      tags: contractLocalInfo?.tags,
      lists: contractLocalInfo?.lists,
    };
  });

  return useMemo(() => {
    return {
      recentContracts: recentContracts.filter(searchFilterFn(keyword)),
      isLoading,
    };
  }, [isLoading, recentContracts, keyword]);
};
