import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";

import { NoMobile } from "./modal";

interface MobileGuardProps {
  children: ReactNode;
}
export const MobileGuard = ({ children }: MobileGuardProps) => {
  const isMobile = useMobile();
  return isMobile ? <NoMobile /> : <>{children}</>;
};
