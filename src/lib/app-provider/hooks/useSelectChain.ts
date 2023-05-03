import { useRouter } from "next/router";
import { useCallback } from "react";

import { useCelatoneApp } from "./useCelatoneApp";

export const useSelectChain = () => {
  const router = useRouter();
  const { handleOnChainIdChange } = useCelatoneApp();

  return useCallback(
    (chainId: string) => {
      if (router.query.network === chainId) return;
      handleOnChainIdChange(chainId);
    },
    [handleOnChainIdChange, router.query.network]
  );
};
