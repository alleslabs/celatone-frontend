import { useWallet } from "@cosmos-kit/react";

import { useCelatoneApp } from "../contexts";

export const useRPCEndpoint = () => {
  const { currentChainRecord } = useWallet();
  const { chainConfig } = useCelatoneApp();

  return currentChainRecord?.preferredEndpoints?.rpc?.[0] ?? chainConfig.rpc;
};
