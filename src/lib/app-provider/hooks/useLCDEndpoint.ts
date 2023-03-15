import { useWallet } from "@cosmos-kit/react";

import { FALLBACK_LCD_ENDPOINT } from "env";

export const useLCDEndpoint = () => {
  const { currentChainRecord, currentChainName } = useWallet();

  return (
    currentChainRecord?.preferredEndpoints?.rest?.[0] ??
    FALLBACK_LCD_ENDPOINT[currentChainName]
  );
};
