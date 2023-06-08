import { useWallet } from "@cosmos-kit/react";

import { useCelatoneApp } from "../contexts";

export const useLCDEndpoint = () => {
  const { currentChainRecord } = useWallet();
  const { chainConfig } = useCelatoneApp();

  return currentChainRecord?.preferredEndpoints?.rest?.[0] ?? chainConfig.lcd;
};
