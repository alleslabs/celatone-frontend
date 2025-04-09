import { InitiaTerms as ReactAppShellInitiaTerms } from "@initia/react-app-shell";
import type { ReactNode } from "react";
import { useInitia } from "lib/app-provider";

export const InitiaTerms = ({ children }: { children: ReactNode }) => {
  const isInitia = useInitia();

  return isInitia ? (
    <ReactAppShellInitiaTerms>{children}</ReactAppShellInitiaTerms>
  ) : (
    children
  );
};
