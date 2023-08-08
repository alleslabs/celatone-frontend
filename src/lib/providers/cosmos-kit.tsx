import type { EndpointOptions } from "@cosmos-kit/core";
import { ChainProvider as Provider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";

import { CHAIN_CONFIGS } from "config";
import { useCelatoneApp } from "lib/app-provider";
import {
  localosmosis,
  localosmosisAsset,
} from "lib/chain-registry/localosmosis";
import { sei, seiAssets } from "lib/chain-registry/sei";

// Remark: The avaliable wallet list won't change after the app is loaded.
// So we have to revisit this later if we have another solution.
export const ChainProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    chainConfig: { wallets },
  } = useCelatoneApp();
  const availableChainsEndpoints = Object.values(CHAIN_CONFIGS).reduce<
    EndpointOptions["endpoints"]
  >(
    (endpoints, config) => ({
      ...endpoints,
      [config.registryChainName]: {
        rpc: [config.rpc],
        rest: [config.lcd],
      },
    }),
    {}
  );

  return (
    <Provider
      chains={[...chains, localosmosis, sei]}
      assetLists={[...assets, localosmosisAsset, seiAssets]}
      wallets={wallets}
      endpointOptions={{
        isLazy: true,
        endpoints: availableChainsEndpoints,
      }}
      signerOptions={{
        preferredSignType: () => "direct",
      }}
    >
      {children}
    </Provider>
  );
};
