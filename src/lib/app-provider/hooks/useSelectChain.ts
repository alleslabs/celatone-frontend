import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { useInternalNavigate } from "lib/app-provider/hooks/useInternalNavigate";
import { getNetworkByChainName } from "lib/data";

export const useSelectChain = () => {
  const router = useRouter();
  const { currentChainName, setCurrentChain } = useWallet();
  const navigate = useInternalNavigate();

  return useCallback(
    (chainName: string) => {
      if (chainName === currentChainName) return;
      setCurrentChain(chainName);
      navigate({
        pathname: router.pathname.replace("/[network]", ""),
        query: {
          ...router.query,
          network: getNetworkByChainName(chainName),
        },
      });
    },
    [currentChainName, setCurrentChain, navigate, router]
  );
};
