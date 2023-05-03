import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import { getFirstQueryParam } from "lib/utils";

export const useNetworkChange = (
  availableChainIds: string[],
  handleOnChainIdChange: (newChainId: string) => void
) => {
  const router = useRouter();
  const networkRef = useRef<string>();

  const defaultChainId = availableChainIds[0] ?? "";
  useEffect(() => {
    if (router.isReady) {
      let networkRoute = getFirstQueryParam(
        router.query.network,
        defaultChainId
      );

      if (availableChainIds.every((chainId) => chainId !== networkRoute))
        networkRoute = defaultChainId;

      if (networkRoute !== networkRef.current) {
        networkRef.current = networkRoute;
        handleOnChainIdChange(networkRoute);
      }
    }
  }, [
    availableChainIds,
    defaultChainId,
    handleOnChainIdChange,
    router.isReady,
    router.query.network,
  ]);
};
