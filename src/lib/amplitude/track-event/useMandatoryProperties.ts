import { fromBech32 } from "@cosmjs/encoding";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { useCelatoneApp, useNavContext } from "lib/app-provider/contexts";
import { useCurrentChain, useMobile } from "lib/app-provider/hooks";
import { sha256Hex } from "lib/utils";

export const useMandatoryProperties = () => {
  const { currentChainId } = useCelatoneApp();
  const { isExpand, isDevMode, prevPathname } = useNavContext();
  const { address } = useCurrentChain();
  const isMobile = useMobile();
  const router = useRouter();

  // TODO: make utility function
  const rawAddressHash = address
    ? sha256Hex(fromBech32(address).data)
    : "Not Connected";

  return useMemo(
    () => ({
      page: router.pathname.replace("/[network]", ""),
      prevPathname,
      rawAddressHash,
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
      rawAddressHash,
    ]
  );
};
