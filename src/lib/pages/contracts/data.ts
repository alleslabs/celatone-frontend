import type { ContractInfo } from "lib/types";

import { useQueryEvents } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { useContracts } from "lib/services/wasm/contract";

export const useRecentContracts = (
  pageSize: number,
  offset: number,
  setTotalData: (totalData: number) => void
) => {
  const { getContractLocalInfo } = useContractStore();
  const contractQuery = useContracts(pageSize, offset);
  useQueryEvents(contractQuery, {
    onSuccess: (data) => setTotalData(data.total),
  });
  const { data: contracts, isLoading } = contractQuery;

  if (!contracts) return { data: undefined, isLoading };
  return {
    data: {
      items: contractQuery.data.items.map<ContractInfo>((contract) => {
        const localInfo = getContractLocalInfo(contract.contractAddress);
        return {
          ...contract,
          description: localInfo?.description,
          lists: localInfo?.lists,
          name: localInfo?.name,
          tags: localInfo?.tags,
        };
      }),
      total: contracts.total,
    },
    isLoading,
  };
};
