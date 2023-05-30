import { useMemo } from "react";

import { useContractSearchFilter } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useContractListQuery } from "lib/services/contractService";
import type { ContractInfo } from "lib/types";

interface RecentContractsData {
  recentContracts: ContractInfo[];
  isLoading: boolean;
}

export const useRecentContractsData = (
  keyword: string
): RecentContractsData => {
  const { getContractLocalInfo } = useContractStore();
  const { data: rawRecentContracts = [], isLoading } = useContractListQuery();
  const searchFilterFn = useContractSearchFilter(keyword);

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
      recentContracts: recentContracts.filter(searchFilterFn),
      isLoading,
    };
  }, [isLoading, recentContracts, searchFilterFn]);
};
