import { fromBech32 } from "@cosmjs/encoding";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { useCelatoneApp, useNavContext } from "lib/app-provider/contexts";
import { useCurrentChain, useMobile } from "lib/app-provider/hooks";
import { StorageKeys } from "lib/data";
import { sha256Hex, getItem } from "lib/utils";

export const useMandatoryProperties = () => {
  const { currentChainId } = useCelatoneApp();
  const { prevPathname } = useNavContext();
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
      navSidebar: getItem(StorageKeys.NavSidebar, ""),
      devSidebar: getItem(StorageKeys.DevSidebar, ""),
      projectSidebar: getItem(StorageKeys.ProjectSidebar, ""),
    }),
    [currentChainId, isMobile, prevPathname, router.pathname, rawAddressHash]
  );
};
