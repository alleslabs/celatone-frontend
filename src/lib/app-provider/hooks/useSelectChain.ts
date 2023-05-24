import { useRouter } from "next/router";
import { useCallback } from "react";

import { useCelatoneApp } from "../contexts/app";

import { useInternalNavigate } from "./useInternalNavigate";

export const useSelectChain = () => {
  const router = useRouter();
  const navigator = useInternalNavigate();
  const { handleOnChainIdChange } = useCelatoneApp();

  return useCallback(
    (chainId: string) => {
      if (router.query.network === chainId) return;

      // Remark: This is workaround solution to set new chainId and replace the pathname
      handleOnChainIdChange(chainId);

      navigator({
        pathname: router.pathname.replace("/[network]", ""),
        query: {
          ...router.query,
          network: chainId,
        },
      });
    },
    [handleOnChainIdChange, navigator, router.pathname, router.query]
  );
};
