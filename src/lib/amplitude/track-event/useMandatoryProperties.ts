import { createHash } from "crypto";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { useCelatoneApp, useNavContext } from "lib/app-provider/contexts";
import { useCurrentChain, useMobile } from "lib/app-provider/hooks";

export const useMandatoryProperties = () => {
  const { currentChainId } = useCelatoneApp();
  const { isExpand, isDevMode, prevPathname } = useNavContext();
  const { address } = useCurrentChain();
  const isMobile = useMobile();
  const router = useRouter();

  // TODO: make util function
  const walletAddress = address
    ? createHash("sha256").update(address).digest("hex")
    : "Not Connected";

  return useMemo(
    () => ({
      page: router.pathname.replace("/[network]", ""),
      prevPathname,
      walletAddress,
      chain: currentChainId,
      mobile: isMobile,
      navOpen: isExpand,
      devMode: isDevMode,
    }),
    [
      currentChainId,
      isDevMode,
      isExpand,
      isMobile,
      prevPathname,
      router.pathname,
      walletAddress,
    ]
  );
};
