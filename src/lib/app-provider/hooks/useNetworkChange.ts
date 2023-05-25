import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { DEFAULT_SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "env";
import { getFirstQueryParam } from "lib/utils";

export const useNetworkChange = (
  handleOnChainIdChange: (newChainId: string) => void
) => {
  const router = useRouter();
  const networkRef = useRef<string>();

  useEffect(() => {
    let networkRoute = router.query.network
      ? getFirstQueryParam(router.query.network, DEFAULT_SUPPORTED_CHAIN_ID)
      : router.asPath.split("/")[1];

    if (router.isReady || router.pathname === "/404") {
      // Redirect to default chain if the chain is not supported by the app
      if (!SUPPORTED_CHAIN_IDS.includes(networkRoute))
        networkRoute = DEFAULT_SUPPORTED_CHAIN_ID;

      if (networkRoute !== networkRef.current) {
        networkRef.current = networkRoute;
        handleOnChainIdChange(networkRoute);
      }
    }
  }, [
    handleOnChainIdChange,
    router.asPath,
    router.isReady,
    router.pathname,
    router.query.network,
  ]);
};
