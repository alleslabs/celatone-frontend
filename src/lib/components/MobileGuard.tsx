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
    pathName.includes(`account`) || pathName.includes(`/txs/`);
  if (isResponsive && isMobile) return <>{children}</>;
  if (!isResponsive && isMobile) return <NoMobile />;
  return <>{children}</>;
};
