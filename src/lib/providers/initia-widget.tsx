import type { PropsWithChildren } from "react";

import {
  injectStyles,
  InterwovenKitProvider,
} from "@initia/interwovenkit-react";
import InterwovenKitStyles from "@initia/interwovenkit-react/styles.js";
import { useCelatoneApp, useWagmiConfig } from "lib/app-provider";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { useL1InfoByNetworkType } from "lib/hooks";
import { useEffect } from "react";
import { WagmiProvider } from "wagmi";

const WithInitiaWidget = ({ children }: PropsWithChildren) => {
  const { chainConfig, currentChainId } = useCelatoneApp();
  const { configs } = useL1InfoByNetworkType();

  useEffect(() => {
    injectStyles(InterwovenKitStyles);
  }, []);

  return (
    <InterwovenKitProvider
      customChain={
        chainConfig.network_type === "local"
          ? {
              apis: {
                "json-rpc": chainConfig.features.evm.enabled
                  ? [{ address: chainConfig.features.evm.jsonRpc }]
                  : undefined,
                rest: [{ address: chainConfig.rest }],
                rpc: [{ address: chainConfig.rpc }],
              },
              bech32_prefix: "init" as const,
              chain_id: currentChainId,
              chain_name: chainConfig.chain,
              fees: chainConfig.fees ?? { fee_tokens: [] },
              logo_URIs: chainConfig.logo_URIs,
              network_type: "devnet",
              pretty_name: chainConfig.prettyName,
              slip44: chainConfig.registry?.slip44,
              staking: chainConfig.registry?.staking,
            }
          : undefined
      }
      {...configs}
    >
      {children}
    </InterwovenKitProvider>
  );
};

export const InitiaWidgetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wagmiConfig = useWagmiConfig();

  if (!wagmiConfig) {
    return <LoadingOverlay />;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <WithInitiaWidget>{children}</WithInitiaWidget>
    </WagmiProvider>
  );
};
