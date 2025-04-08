import { MAINNET, TESTNET } from "@initia/react-wallet-widget/ssr";

import { useCelatoneApp } from "lib/app-provider";
import { zHexAddr32 } from "lib/types";

export const useL1InfoByNetworkType = () => {
  const { chainConfig } = useCelatoneApp();
  const chainInfo = chainConfig.network_type === "mainnet" ? MAINNET : TESTNET;

  return {
    l1Rest: chainInfo.apiUrl.replace("api", "rest"),
    l1Usernames: zHexAddr32.parse(chainInfo.modules.usernames),
  };
};
