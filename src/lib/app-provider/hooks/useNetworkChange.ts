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
    const networkRoute = router.query.network
      ? getFirstQueryParam(router.query.network, DEFAULT_SUPPORTED_CHAIN_ID)
      : router.asPath.split("/")[1];

    if (router.isReady || router.pathname === "/404") {
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
          pathname: "/",
          replace: true,
        });
      } else if (networkRoute !== networkRef.current) {
        networkRef.current = networkRoute;
        handleOnChainIdChange(networkRoute);
      }
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
