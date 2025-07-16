import type { EndpointOptions } from "@cosmos-kit/core";

import { ChainProvider as Provider } from "@cosmos-kit/react";
import { useCelatoneApp, useChainConfigs } from "lib/app-provider";
import { getWallets } from "lib/utils";

import { getCustomedSigningCosmwasm } from "./options";

// Remark: The available wallet list won't change after the app is loaded.
// So we have to revisit this later if we have another solution.
export const CosmosKitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    chainConfig: { chain, wallets },
  } = useCelatoneApp();
  const { chainConfigs, registryAssets, registryChains } = useChainConfigs();
  const availableChainsEndpoints = Object.values(chainConfigs).reduce<
    EndpointOptions["endpoints"]
  >(
    (endpoints, config) => ({
      ...endpoints,
      [config.registryChainName]: {
        rest: [config.rest],
        rpc: [config.rpc],
      },
    }),
    {}
  );

  return (
    <Provider
      key={chain}
      assetLists={registryAssets}
      chains={registryChains}
      endpointOptions={{
        endpoints: availableChainsEndpoints,
        isLazy: true,
      }}
      signerOptions={{
        preferredSignType: () => "direct",
        signingCosmwasm: () => getCustomedSigningCosmwasm(),
      }}
      // TODO
      walletConnectOptions={{
        signClient: {
          projectId: "89b53d909ae6d042df584d8fb0491a77",
          relayUrl: "wss://relay.walletconnect.org",
        },
      }}
      wallets={getWallets(wallets)}
    >
      {children}
    </Provider>
  );
};
