import type { ChainContext as CosmosChainContext } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";

import { useCelatoneApp } from "../contexts";
import type { BechAddr20, Option } from "lib/types";

interface ChainContext extends Omit<CosmosChainContext, "address"> {
  address: Option<BechAddr20>;
}

export const useCurrentChain = (): ChainContext => {
  const {
    chainConfig: { registryChainName },
  } = useCelatoneApp();

  const { address, ...res } = useChain(registryChainName);
  return {
    address: address as Option<BechAddr20>,
    ...res,
  };
};
