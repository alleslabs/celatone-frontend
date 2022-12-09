import { useWallet } from "@cosmos-kit/react";

import { ENDPOINT_REGISTRY } from "lib/data";

export const useEndpoint = () => {
  const { currentChainName } = useWallet();
  return ENDPOINT_REGISTRY[currentChainName];
};
