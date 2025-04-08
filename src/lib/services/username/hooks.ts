import { MAINNET, TESTNET } from "@initia/react-wallet-widget/ssr";

import { useCallback } from "react";
import { useCelatoneApp } from "lib/app-provider";
import { zHexAddr32 } from "lib/types";

export const useL1InfoByNetworkType = () => {
  const { chainConfig } = useCelatoneApp();

  return useCallback(() => {
    switch (chainConfig.network_type) {
      case "mainnet":
        return {
          l1Rest: MAINNET.apiUrl.replace("api", "rest"),
          l1Usernames: zHexAddr32.parse(MAINNET.modules.usernames),
        };
      case "testnet":
        return {
          l1Rest: TESTNET.apiUrl.replace("api", "rest"),
          l1Usernames: zHexAddr32.parse(TESTNET.modules.usernames),
        };
      default:
        throw new Error("Invalid network type (useL1InfoByNetworkType)");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(chainConfig)]);
};
