import { useWallet } from "@cosmos-kit/react";

import { INSTANTIATED_LIST_NAME } from "lib/data";
import { useContractStore, useUserKey } from "lib/hooks";
import {
  useInstantiatedCountByUserQuery,
  useInstantiatedListByUserQuery,
} from "lib/services/contractService";
import type { ContractListInfo } from "lib/stores/contract";
import { formatSlugName } from "lib/utils";

export const useInstantiatedByMe = (enable: boolean): ContractListInfo => {
  const { address } = useWallet();
  const { data: contracts = [] } = useInstantiatedListByUserQuery(
    enable ? address : undefined
  );

  const userKey = useUserKey();
  const { getContractInfo } = useContractStore();

  return {
    contracts: contracts.map((contract) => ({
      ...contract,
      ...getContractInfo(userKey, contract.address),
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
