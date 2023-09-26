import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { DEFAULT_SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "env";
import { getFirstQueryParam } from "lib/utils";

import { useInternalNavigate } from "./useInternalNavigate";

export const useNetworkChange = (
  handleOnChainIdChange: (newChainId: string) => void
) => {
  const router = useRouter();
  const networkRef = useRef<string>();
  const navigate = useInternalNavigate();

  useEffect(() => {
    if (router.isReady) {
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
        !SUPPORTED_CHAIN_IDS.includes(networkRoute)
      ) {
        navigate({
          pathname: "/404",
          query: {
            network: DEFAULT_SUPPORTED_CHAIN_ID,
          },
        });
      } else if (networkRoute !== networkRef.current) {
        networkRef.current = networkRoute;
        handleOnChainIdChange(networkRoute);
      }
    } else if (router.pathname === "/404") {
      const networkRoute = router.asPath.split("/")[1];
      navigate({
        pathname: "/404",
        query: {
          network: SUPPORTED_CHAIN_IDS.includes(networkRoute)
            ? networkRoute
            : DEFAULT_SUPPORTED_CHAIN_ID,
        },
      });
    }
  }, [
    handleOnChainIdChange,
    navigate,
    router.asPath,
    router.isReady,
    router.pathname,
    router.query,
  ]);
};
