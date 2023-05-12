import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { getChainNameByNetwork } from "lib/data";
import type { Network } from "lib/data";
import { getFirstQueryParam } from "lib/utils";

export const useNetworkChange = () => {
  const router = useRouter();
  const { currentChainName, setCurrentChain } = useWallet();
  const networkRef = useRef<string>();

  useEffect(() => {
    if (router.isReady) {
      let networkRoute = getFirstQueryParam(
        router.query.network,
        "testnet"
      ) as Network;

      if (
        networkRoute !== "mainnet" &&
        networkRoute !== "testnet" &&
        networkRoute !== "localnet"
      )
        networkRoute = "testnet";

      if (networkRoute !== networkRef.current) {
        networkRef.current = networkRoute;
        const chainName = getChainNameByNetwork(networkRoute);
        if (currentChainName !== chainName) setCurrentChain(chainName);
      }
    }
  }, [router, currentChainName, setCurrentChain]);
};
