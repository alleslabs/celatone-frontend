import type { WalletWidget, WidgetConfig } from "@initia/utils";
import type { ReactNode, PropsWithChildren } from "react";

import { context, loadScript } from "@initia/react-wallet-widget/ssr";
import { useCelatoneApp, useWasmConfig } from "lib/app-provider";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { useL1InfoByNetworkType } from "lib/hooks";
import { useEffect, useState } from "react";

import pkg from "../../../package.json";

declare global {
  interface Window {
    createWalletWidget?: (config: WidgetConfig) => Promise<WalletWidget>;
  }
}

const WalletWidgetProvider = ({
  children,
  fallback = null,
  ...config
}: PropsWithChildren<WidgetConfig> & {
  fallback?: ReactNode;
}) => {
  const [widget, setWidget] = useState<WalletWidget | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function setup() {
      await loadScript(
        `https://cdn.jsdelivr.net/npm/@initia/wallet-widget@${pkg.dependencies["@initia/react-wallet-widget"]}/dist/index.js`
      );
      const widget = await window.createWalletWidget!(config);
      setWidget(widget);
    }

    setup();
  }, [config]);

  if (!widget) return fallback;

  return <context.Provider value={widget}>{children}</context.Provider>;
};

export const InitiaWidgetProvider = ({ children }: { children: ReactNode }) => {
  const { chainConfig, currentChainId } = useCelatoneApp();
  const enabledWasm = useWasmConfig({ shouldRedirect: false });
  const { configs } = useL1InfoByNetworkType();
  return (
    <WalletWidgetProvider
      key={currentChainId}
      customLayer={
        chainConfig.network_type === "local"
          ? {
              apis: {
                rest: [{ address: chainConfig.rest }],
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
              slip44: chainConfig.registry?.slip44,
            }
          : undefined
      }
      fallback={<LoadingOverlay />}
      useKeplrAsDirectSigner={enabledWasm.enabled}
      {...configs}
    >
      {children}
    </WalletWidgetProvider>
  );
};
