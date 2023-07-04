import { useChain } from "@cosmos-kit/react";

import { useCelatoneApp } from "../contexts";

export const useCurrentChain = () => {
  const {
    chainConfig: { registryChainName },
  } = useCelatoneApp();
  return useChain(registryChainName);
};
