import { WalletWidgetProvider } from "@initia/react-wallet-widget";
import type { ReactNode } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { LoadingOverlay } from "lib/components/LoadingOverlay";

export const InitiaWidgetProvider = ({ children }: { children: ReactNode }) => {
  const { chainConfig, currentChainId } = useCelatoneApp();

  return (
    <WalletWidgetProvider
      key={chainConfig.network_type === "local" ? currentChainId : undefined}
      customLayer={
        chainConfig.network_type === "local"
          ? {
              apis: {
                rest: [{ address: chainConfig.lcd }],
                rpc: [{ address: chainConfig.rpc }],
                "json-rpc": chainConfig.features.evm.enabled
                  ? [{ address: chainConfig.features.evm.jsonRpc }]
                  : undefined,
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
      fallback={<LoadingOverlay />}
    >
      {children}
    </WalletWidgetProvider>
  );
};
