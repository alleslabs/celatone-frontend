import { useCurrentChain, useTierConfig } from "lib/app-provider";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/providers/store";
import {
  useInstantiatedContractsByAddress,
  useInstantiatedContractsByAddressLcd,
} from "lib/services/wasm/contract";
import type { ContractListInfo } from "lib/stores/contract";
import { formatSlugName, getCurrentDate } from "lib/utils";

interface InstantiatedByMeState {
  instantiatedListInfo: ContractListInfo;
  isLoading: boolean;
}

export const useInstantiatedByMe = (enable: boolean): InstantiatedByMeState => {
  const { address } = useCurrentChain();
  const { isFullTier } = useTierConfig();

  const { data: dataApi, isLoading: isApiLoading } =
    useInstantiatedContractsByAddress(address, 500, 0, enable && isFullTier);
  const { data: dataLcd, isLoading: isLcdLoading } =
    useInstantiatedContractsByAddressLcd(address, enable && !isFullTier);

  const [contracts = [], isLoading] = isFullTier
    ? [dataApi?.items, isApiLoading]
    : [dataLcd, isLcdLoading];
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
