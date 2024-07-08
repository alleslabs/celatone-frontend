import { useCurrentChain, useTierConfig } from "lib/app-provider";
import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore } from "lib/providers/store";
import {
  useInstantiatedContractsByAddressLcd,
  useInstantiatedCountByAddress,
  useInstantiatedListByAddress,
} from "lib/services/wasm/contract";
import type { ContractListInfo } from "lib/stores/contract";
import type { BechAddr, BechAddr32 } from "lib/types";
import { formatSlugName, getCurrentDate, getDefaultDate } from "lib/utils";

interface InstantiatedByMeState {
  instantiatedListInfo: ContractListInfo;
  isLoading: boolean;
}

export const useInstantiatedByMe = (enable: boolean): InstantiatedByMeState => {
  const { address } = useCurrentChain();
  const { isFullTier } = useTierConfig();

  const resApi = useInstantiatedListByAddress(address, enable && isFullTier);
  const resLcd = useInstantiatedContractsByAddressLcd(
    address,
    enable && !isFullTier
  );

  const { data: contracts = [], isLoading } = isFullTier ? resApi : resLcd;
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
  const { isFullTier } = useTierConfig();
  const resApi = useInstantiatedCountByAddress(address);
  const resLcd = useInstantiatedContractsByAddressLcd(address, !isFullTier);
  const count = isFullTier ? resApi.data : resLcd.data?.length ?? 0;

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
