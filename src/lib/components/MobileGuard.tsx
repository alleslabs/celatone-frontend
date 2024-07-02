import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { useCelatoneApp, useMobile } from "lib/app-provider";

import { NoMobile } from "./modal";

interface MobileGuardProps {
  children: ReactNode;
}
export const MobileGuard = ({ children }: MobileGuardProps) => {
  const router = useRouter();
  const isMobile = useMobile();
  const { currentChainId } = useCelatoneApp();

  const pathName = router.asPath;
  const isResponsive =
    pathName === `/${currentChainId}` ||
    pathName.includes(`/accounts`) ||
    pathName.includes(`/txs`) ||
    pathName.includes(`/blocks`) ||
    pathName.includes(`/projects`) ||
    pathName.includes(`/interact-contract`) ||
    pathName.includes(`/404`) ||
    pathName.includes(`/proposals`) ||
    pathName.includes(`/nft-collections`) ||
    // wasm
    pathName.includes(`/contracts`) ||
    pathName.includes(`/codes`) ||
    // move
    pathName.includes(`/modules`) ||
    pathName.includes(`/interact`) ||
    // validators
    pathName.includes(`/validators`);

  if (!isResponsive && isMobile) return <NoMobile />;
  return <>{children}</>;
};
