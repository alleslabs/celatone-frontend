import type { ContractListInfo } from "lib/stores/contract";

import { useCurrentChain, useTierConfig } from "lib/app-provider";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/providers/store";
import {
  useAllInstantiatedContractsByAddress,
  useInstantiatedContractsByAddressRest,
} from "lib/services/wasm/contract";
import { formatSlugName, getCurrentDate } from "lib/utils";

interface InstantiatedByMeState {
  instantiatedListInfo: ContractListInfo;
  isLoading: boolean;
}

export const useInstantiatedByMe = (enable: boolean): InstantiatedByMeState => {
  const { address } = useCurrentChain();
  const { isFullTier } = useTierConfig();

  const { data: dataApi, isLoading: isApiLoading } =
    useAllInstantiatedContractsByAddress(address, enable && isFullTier);
  const { data: dataRest, isLoading: isRestLoading } =
    useInstantiatedContractsByAddressRest(address, enable && !isFullTier);

  const [contracts = [], isLoading] = isFullTier
    ? [dataApi?.items, isApiLoading]
    : [dataRest, isRestLoading];
  const { getContractLocalInfo } = useContractStore();

  return {
    instantiatedListInfo: {
      contracts: contracts.map((contract) => ({
        ...contract,
        ...getContractLocalInfo(contract.contractAddress),
      })),
      isContractRemovable: false,
      isInfoEditable: false,
      lastUpdated: getCurrentDate(),
      name: INSTANTIATED_LIST_NAME,
      slug: formatSlugName(INSTANTIATED_LIST_NAME),
    },
    isLoading,
  };
};
