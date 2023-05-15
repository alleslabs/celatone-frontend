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
    if (router.isReady) {
      let networkRoute = getFirstQueryParam(
        router.query.network,
        DEFAULT_SUPPORTED_CHAIN_ID
      );

      // Redirect to default chain if the chain is not supported by the app
      if (!SUPPORTED_CHAIN_IDS.includes(networkRoute))
        networkRoute = DEFAULT_SUPPORTED_CHAIN_ID;

      if (networkRoute !== networkRef.current) {
        networkRef.current = networkRoute;
        handleOnChainIdChange(networkRoute);
      }
    }
  }, [handleOnChainIdChange, router.isReady, router.query.network]);
};
