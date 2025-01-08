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
    chainConfig: { wallets },
  } = useCelatoneApp();
  const { chainConfigs, registryAssets, registryChains } = useChainConfigs();
  const availableChainsEndpoints = Object.values(chainConfigs).reduce<
    EndpointOptions["endpoints"]
  >(
    (endpoints, config) => ({
      ...endpoints,
      [config.registryChainName]: {
        rest: [config.lcd],
        rpc: [config.rpc],
      },
    }),
    {}
  );

  return (
    <Provider
      assetLists={registryAssets}
      chains={registryChains}
      wallets={getWallets(wallets)}
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
    >
      {children}
    </Provider>
  );
};
