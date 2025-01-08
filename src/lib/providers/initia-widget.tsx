import { WalletWidgetProvider } from "@initia/react-wallet-widget";
import type { ReactNode } from "react";

export const InitiaWidgetProvider = ({ children }: { children: ReactNode }) => (
  <WalletWidgetProvider>{children}</WalletWidgetProvider>
);
