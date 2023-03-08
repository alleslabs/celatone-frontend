import { useWallet } from "@cosmos-kit/react";

import { getNetworkByChainName } from "lib/data";

export const useCurrentNetwork = () => {
  const { currentChainName } = useWallet();
  const network = getNetworkByChainName(currentChainName);

  return {
    network,
    isMainnet: network === "mainnet",
    isTestnet: network === "testnet",
    isLocalnet: network === "localnet",
  };
};
