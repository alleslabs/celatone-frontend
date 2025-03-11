import type { EndpointOptions } from "@cosmos-kit/core";
import { ChainProvider as Provider } from "@cosmos-kit/react";

import { useCelatoneApp, useChainConfigs } from "lib/app-provider";
import { getWallets } from "lib/utils";

import { getCustomedSigningCosmwasm } from "./options";

// Remark: The avaliable wallet list won't change after the app is loaded.
// So we have to revisit this later if we have another solution.
export const CosmosKitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    chainConfig: { wallets, chain },
  } = useCelatoneApp();
  const { chainConfigs, registryChains, registryAssets } = useChainConfigs();
  const availableChainsEndpoints = Object.values(chainConfigs).reduce<
    EndpointOptions["endpoints"]
  >(
    (endpoints, config) => ({
      ...endpoints,
      [config.registryChainName]: {
        rpc: [config.rpc],
        rest: [config.rest],
      },
    }),
    {}
  );

  return (
    <Provider
      key={chain}
      chains={registryChains}
      assetLists={registryAssets}
      wallets={getWallets(wallets)}
      // TODO
      walletConnectOptions={{
        signClient: {
          projectId: "89b53d909ae6d042df584d8fb0491a77",
          relayUrl: "wss://relay.walletconnect.org",
        },
      }}
      endpointOptions={{
        isLazy: true,
        endpoints: availableChainsEndpoints,
      }}
      signerOptions={{
        signingCosmwasm: () => getCustomedSigningCosmwasm(),
        preferredSignType: () => "direct",
      }}
    >
      {children}
    </Provider>
  );
};
