import { context, loadScript } from "@initia/react-wallet-widget/ssr";
import type { WalletWidget, WidgetConfig, WidgetWallet } from "@initia/utils";
import { useEffect, useState } from "react";
import type { ReactNode, PropsWithChildren } from "react";

import { SUPPORTED_NETWORK_TYPES } from "env";
import { useCelatoneApp, useWasmConfig } from "lib/app-provider";
import { LoadingOverlay } from "lib/components/LoadingOverlay";

declare global {
  interface Window {
    createWalletWidget?: (config: WidgetConfig) => Promise<WalletWidget>;
  }
}

// You can specify the version of wallet-widget you want to use here.
// While you can use "latest", we recommend explicitly specifying the latest version number and updating it manually when needed for better stability.
// (You can check the latest available version here: https://www.npmjs.com/package/@initia/wallet-widget)
const VERSION = "1.0.0";

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
        `https://cdn.jsdelivr.net/npm/@initia/wallet-widget@${VERSION}/dist/index.js`
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

  const testnetConfigs = {
    registryUrl: "https://registry.testnet.initia.xyz",
    apiUrl: "https://api.testnet.initia.xyz",
    dexApiUrl: "https://dex-api.testnet.initia.xyz",
    explorerUrl: "https://scan.testnet.initia.xyz",
    swaplistUrl: "https://list.testnet.initia.xyz/pairs.json",
    modules: {
      usernames:
        "0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a",
      dex_utils:
        "0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a",
      swap_transfer:
        "0x42cd8467b1c86e59bf319e5664a09b6b5840bb3fac64f5ce690b5041c530565a",
    },
    filterWallet: (wallet: WidgetWallet) =>
      !chainConfig.features.evm.enabled || wallet.type === "evm",
  };

  const networkType =
    SUPPORTED_NETWORK_TYPES.length > 1
      ? chainConfig.network_type
      : SUPPORTED_NETWORK_TYPES[0];

  return (
    <WalletWidgetProvider
      key={currentChainId}
      useKeplrAsDirectSigner={enabledWasm.enabled}
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
      {...(networkType !== "mainnet" && testnetConfigs)}
    >
      {children}
    </WalletWidgetProvider>
  );
};
