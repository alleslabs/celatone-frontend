import { useRouter } from "next/router";
import { useCallback } from "react";

import { useCelatoneApp } from "../contexts/app";

export const useSelectChain = () => {
  const router = useRouter();
  const { handleOnChainIdChange } = useCelatoneApp();

  return useCallback(
    (chainId: string) => {
      if (router.query.network === chainId) return;

      // TODO: Should we check if the chain is supported by the app here?
      handleOnChainIdChange(chainId);
    },
    [handleOnChainIdChange, router.query.network]
  );
};
