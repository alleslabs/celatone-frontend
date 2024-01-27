import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";

import { NoMobile } from "./modal";

interface MobileGuardProps {
  children: ReactNode;
}
export const MobileGuard = ({ children }: MobileGuardProps) => {
  const router = useRouter();
  const pathName = router.asPath;
  const isMobile = useMobile();
  const isResponsive =
    pathName.includes(`/accounts`) ||
    pathName.includes(`/txs`) ||
    pathName.includes(`/blocks`) ||
    pathName.includes(`/projects`) ||
    pathName.includes(`/query`) ||
    pathName.includes(`/404`) ||
    pathName.includes(`/proposals`) ||
    pathName.includes(`/nft-collections`) ||
    // wasm
    pathName.includes(`/contracts`) ||
    pathName.includes(`/codes`) ||
    // move
    pathName.includes(`/modules`);

  if (isResponsive && isMobile) return <>{children}</>;
  if (!isResponsive && isMobile) return <NoMobile />;
  return <>{children}</>;
};
