import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";

import { getNetworkByChainName } from "lib/data";
import type { Network } from "lib/data";

export const useCurrentNetwork = () => {
  const { currentChainName } = useWallet();
  const router = useRouter();

  // Revisit: this is a hack to fix the issue of the walletManager being
  try {
    const network = getNetworkByChainName(currentChainName);
    return {
      network,
      isMainnet: network === "mainnet",
      isTestnet: network === "testnet",
      isLocalnet: network === "localnet",
    };
  } catch (e) {
    window.localStorage.removeItem("walletManager");

    // eslint-disable-next-line no-console
    console.log("remove walletManager");
    router.reload();

    // This is mock value, it will be replaced by the real value after the page is reloaded
    return {
      network: "mainnet" as Network,
      isMainnet: true,
      isTestnet: false,
      isLocalnet: false,
    };
  }
};
