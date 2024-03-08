import { useCurrentChain } from "lib/app-provider";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/providers/store";
import {
  useInstantiatedCountByUserQuery,
  useInstantiatedListByUserQuery,
} from "lib/services/contractService";
import type { ContractListInfo } from "lib/stores/contract";
import type { BechAddr, BechAddr32 } from "lib/types";
import { formatSlugName, getCurrentDate, getDefaultDate } from "lib/utils";

interface InstantiatedByMeState {
  instantiatedListInfo: ContractListInfo;
  isLoading: boolean;
}

export const useInstantiatedByMe = (enable: boolean): InstantiatedByMeState => {
  const { address } = useCurrentChain();
  const { data: contracts = [], isLoading } = useInstantiatedListByUserQuery(
    enable ? address : undefined
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
  const { address } = useCurrentChain();
  const { data: count } = useInstantiatedCountByUserQuery(address);

  return {
    contracts: Array.from({ length: count ?? 0 }, () => ({
      contractAddress: "" as BechAddr32,
      instantiator: "" as BechAddr,
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
