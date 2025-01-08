import { WalletWidgetProvider } from "@initia/react-wallet-widget";
import type { ReactNode } from "react";

import { useCelatoneApp } from "lib/app-provider";

export const InitiaWidgetProvider = ({ children }: { children: ReactNode }) => {
  const { chainConfig, currentChainId } = useCelatoneApp();

  return (
    <WalletWidgetProvider
      customLayer={
        chainConfig.network_type === "local"
          ? {
              apis: {
                rest: [{ address: chainConfig.lcd }],
                rpc: [{ address: chainConfig.rpc }],
              },
              bech32_prefix: "init" as const,
              chain_id: currentChainId,
              chain_name: chainConfig.chain,
              fees: chainConfig.fees ?? { fee_tokens: [] },
              logo_URIs: chainConfig.logo_URIs,
              network_type: "devnet",
              pretty_name: chainConfig.prettyName,
              staking: chainConfig.registry?.staking,
            }
          : undefined
      }
    >
      {children}
    </WalletWidgetProvider>
  );
};
