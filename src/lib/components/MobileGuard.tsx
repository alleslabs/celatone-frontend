import type { ReactNode } from "react";

import { useChainConfigs, useMobile } from "lib/app-provider";
import { useRouter } from "next/router";

import { NoMobile } from "./modal";

interface MobileGuardProps {
  children: ReactNode;
}
export const MobileGuard = ({ children }: MobileGuardProps) => {
  const router = useRouter();
  const { supportedChainIds } = useChainConfigs();
  const isMobile = useMobile();

  const pathName = router.asPath;
  const isResponsive =
    supportedChainIds.includes(pathName.slice(1)) ||
    pathName.includes(`/accounts`) ||
    pathName.includes(`/txs`) ||
    pathName.includes(`/evm-txs`) ||
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
    pathName.includes(`/validators`) ||
    // evm
    pathName.includes(`/evm-contracts`);

  if (!isResponsive && isMobile) return <NoMobile />;
  return <>{children}</>;
};
