import type { WidgetWallet } from "@initia/utils";

import { MAINNET, TESTNET } from "@initia/interwovenkit-react";
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
      l1Rest: "", // TODO: add rest url
      l1Usernames: zHexAddr32.parse(MAINNET.usernamesModuleAddress),
    };
  }

  return {
    configs: {
      ...TESTNET,
      filterWallet: (wallet: WidgetWallet) =>
        !chainConfig.features.evm.enabled || wallet.type === "evm",
    },
    l1Rest: "", // TODO: add rest url
    l1Usernames: zHexAddr32.parse(TESTNET.usernamesModuleAddress),
  };
};
