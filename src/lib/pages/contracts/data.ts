import { useContractStore } from "lib/providers/store";
import { useContracts } from "lib/services/wasm/contract";
import type { ContractInfo } from "lib/types";

export const useRecentContracts = (
  pageSize: number,
  offset: number,
  setTotalData: (totalData: number) => void
) => {
  const { getContractLocalInfo } = useContractStore();
  const { data: contracts, isLoading } = useContracts(pageSize, offset, {
    onSuccess: (data) => setTotalData(data.total),
  });

  if (!contracts) return { data: undefined, isLoading };
  return {
    data: {
      items: contracts.items.map<ContractInfo>((contract) => {
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
