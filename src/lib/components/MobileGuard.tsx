import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { useCelatoneApp, useMobile } from "lib/app-provider";

import { NoMobile } from "./modal";

interface MobileGuardProps {
  children: ReactNode;
}
export const MobileGuard = ({ children }: MobileGuardProps) => {
  const router = useRouter();
  const pathName = router.asPath;
  const isMobile = useMobile();
  const { currentChainId } = useCelatoneApp();
  const isResponsive =
    pathName.includes(`/account`) ||
    pathName.includes(`/txs`) ||
    pathName.includes(`/blocks`) ||
    pathName.includes(`/projects`) ||
    pathName.includes(`/code`) ||
    pathName.includes(`/collections`) ||
    pathName.includes(`/nft`) ||
    pathName.includes(`/query`) ||
    pathName.includes(`/network-overview`) ||
    pathName.includes(`/dev-home`) ||
    pathName.includes(`/404`) ||
    // wasm
    pathName.includes(`/contracts/`) ||
    pathName === `/${currentChainId}/contracts` ||
    // move
    pathName.includes(`/modules/`) ||
    pathName === `/${currentChainId}/modules` ||
    pathName === `/${currentChainId}`;

  if (isResponsive && isMobile) return <>{children}</>;
  if (!isResponsive && isMobile) return <NoMobile />;
  return <>{children}</>;
};
