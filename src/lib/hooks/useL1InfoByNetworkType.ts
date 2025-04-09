import { MAINNET, TESTNET } from "@initia/react-wallet-widget/ssr";
import type { WidgetWallet } from "@initia/utils";
import { SUPPORTED_NETWORK_TYPES } from "env";

import { useCelatoneApp } from "lib/app-provider";
import { zHexAddr32 } from "lib/types";

export const useL1InfoByNetworkType = () => {
  const { chainConfig } = useCelatoneApp();

  const networkType =
    SUPPORTED_NETWORK_TYPES.length > 1
      ? chainConfig.network_type
      : SUPPORTED_NETWORK_TYPES[0];

  if (networkType === "mainnet") {
    return {
      configs: MAINNET,
      l1Rest: MAINNET.apiUrl.replace("api", "rest"),
      l1Usernames: zHexAddr32.parse(MAINNET.modules.usernames),
    };
  }

  return {
    configs: {
      ...TESTNET,
      filterWallet: (wallet: WidgetWallet) =>
        !chainConfig.features.evm.enabled || wallet.type === "evm",
    },
    l1Rest: TESTNET.apiUrl.replace("api", "rest"),
    l1Usernames: zHexAddr32.parse(TESTNET.modules.usernames),
  };
};
