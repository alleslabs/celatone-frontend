import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { FALLBACK_SUPPORTED_CHAIN_ID } from "env";
import { useChainConfigStore } from "lib/providers/store";
import { getFirstQueryParam } from "lib/utils";

import { useChainConfigs } from "./useChainConfigs";
import { useInternalNavigate } from "./useInternalNavigate";

export const useNetworkChange = (
  handleOnChainIdChange: (newChainId: string) => void
) => {
  const router = useRouter();
  const networkRef = useRef<string>();
  const navigate = useInternalNavigate();
  const { supportedChainIds } = useChainConfigs();
  const { isHydrated: isChainConfigStoreHydrated } = useChainConfigStore();

  useEffect(() => {
    if (router.isReady && isChainConfigStoreHydrated) {
      const networkRoute = getFirstQueryParam(router.query.network);
      // Redirect to default chain if there is no network query provided
      if (!router.query.network) {
        navigate({
          pathname: router.pathname,
          query: { ...router.query },
          replace: true,
        });
      } else if (
        router.pathname === "/[network]" &&
        !supportedChainIds.includes(networkRoute)
      ) {
        // Redirect to default network 404 if `/invalid_network`
        navigate({
          pathname: "/404",
          query: {
            network: FALLBACK_SUPPORTED_CHAIN_ID,
          },
        });
      } else if (networkRoute !== networkRef.current) {
        networkRef.current = networkRoute;
        handleOnChainIdChange(networkRoute);
      }
    } else if (router.pathname === "/404") {
      const networkRoute = router.asPath.split("/")[1];
      // Redirect to the current network 404 if `/current_network/random_path`
      // If the current network is also invalid, redicrect to default network 404
      navigate({
        pathname: "/404",
        query: {
          network: supportedChainIds.includes(networkRoute)
            ? networkRoute
            : FALLBACK_SUPPORTED_CHAIN_ID,
        },
      });
    }
  }, [
    handleOnChainIdChange,
    isChainConfigStoreHydrated,
    navigate,
    router.asPath,
    router.isReady,
    router.pathname,
    router.query,
    supportedChainIds,
  ]);
};
