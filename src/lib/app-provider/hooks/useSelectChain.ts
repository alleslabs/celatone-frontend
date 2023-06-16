import { useRouter } from "next/router";
import { useCallback } from "react";

import { useInternalNavigate } from "./useInternalNavigate";

export const useSelectChain = () => {
  const router = useRouter();
  const navigator = useInternalNavigate();

  return useCallback(
    (chainId: string) => {
      if (router.query.network === chainId) return;

      navigator({
        pathname: router.pathname.replace("/[network]", ""),
        query: {
          ...router.query,
          network: chainId,
        },
      });
    },
    [navigator, router.pathname, router.query]
  );
};
