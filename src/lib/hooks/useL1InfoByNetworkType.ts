import { MAINNET, TESTNET } from "@initia/interwovenkit-react";
import { SUPPORTED_NETWORK_TYPES } from "env";
import { useCelatoneApp, useChainConfigs } from "lib/app-provider";
import { zHexAddr32 } from "lib/types";

export const useL1InfoByNetworkType = () => {
  const { chainConfig } = useCelatoneApp();
  const { chainConfigs } = useChainConfigs();

  const networkType =
    SUPPORTED_NETWORK_TYPES.length > 1
      ? chainConfig.network_type
      : SUPPORTED_NETWORK_TYPES[0];

  if (networkType === "mainnet") {
    return {
      configs: MAINNET,
      l1Rest: chainConfigs[MAINNET.defaultChainId]?.rest ?? "",
      l1Usernames: zHexAddr32.parse(MAINNET.usernamesModuleAddress),
    };
  }

  return {
    configs: {
      ...TESTNET,
    },
    l1Rest: chainConfigs[TESTNET.defaultChainId]?.rest ?? "",
    l1Usernames: zHexAddr32.parse(TESTNET.usernamesModuleAddress),
  };
};
