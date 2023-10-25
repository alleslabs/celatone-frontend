import type { EndpointOptions } from "@cosmos-kit/core";
import { ChainProvider as Provider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";

import { CHAIN_CONFIGS } from "config/chain";
import { useCelatoneApp } from "lib/app-provider";
import {
  initiatestnet,
  initiatestnetAssets,
} from "lib/chain-registry/initiatestnet";
import {
  localosmosis,
  localosmosisAsset,
} from "lib/chain-registry/localosmosis";
import { sei, seiAssets } from "lib/chain-registry/sei";
import {
  terra2testnet,
  terra2testnetAssets,
} from "lib/chain-registry/terra2testnet";

import { getCustomedSigningCosmwasm } from "./options";

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
      chains={[...chains, localosmosis, sei, terra2testnet, ...initiatestnet]}
      assetLists={[
        ...assets,
        localosmosisAsset,
        seiAssets,
        terra2testnetAssets,
        ...initiatestnetAssets,
      ]}
      wallets={wallets}
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
