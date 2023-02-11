import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

import type { Network } from "lib/data";
import { getNetworkByChainName } from "lib/data";
import { getFirstQueryParam } from "lib/utils";

export const useCurrentNetwork = (): Network => {
  const { currentChainName } = useWallet();
  const router = useRouter();

  return useMemo(() => {
    if (router.isReady && router.query.network) {
      let networkRoute = getFirstQueryParam(router.query.network);

      if (
        networkRoute !== "mainnet" &&
        networkRoute !== "testnet" &&
        networkRoute !== "localnet"
      )
        networkRoute = "mainnet";

      return networkRoute as Network;
    }

    return getNetworkByChainName(currentChainName);
  }, [currentChainName, router]);
};
