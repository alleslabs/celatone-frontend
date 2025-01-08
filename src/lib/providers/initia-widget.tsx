import { WalletWidgetProvider } from "@initia/react-wallet-widget";
import type { ReactNode } from "react";

import { useCelatoneApp } from "lib/app-provider";

export const InitiaWidgetProvider = ({ children }: { children: ReactNode }) => {
  const { currentChainId, chainConfig } = useCelatoneApp();

  return (
    <WalletWidgetProvider
      customLayer={{
        chain_id: currentChainId,
        chain_name: chainConfig.chain,
        apis: {
          rpc: [{ address: chainConfig.rpc }],
          rest: [{ address: chainConfig.lcd }],
        },
        fees: chainConfig.fees ?? { fee_tokens: [] },
        bech32_prefix: "init" as const,
        network_type:
          chainConfig.network_type === "local"
            ? "devnet"
            : chainConfig.network_type,
      }}
    >
      {children}
    </WalletWidgetProvider>
  );
};
