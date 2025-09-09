import type { ChainContext as CosmosKitChainContext } from "@cosmos-kit/core";
import type { BechAddr20, Option } from "lib/types";

import { useChain } from "@cosmos-kit/react";
import { useInterwovenKit } from "@initia/interwovenkit-react";
import { zBechAddr20 } from "lib/types";

import { useCelatoneApp } from "../contexts";
import { useInitia } from "./useInitia";

interface CurrentChain {
  address: Option<BechAddr20>;
  bech32Prefix: string;
  chainId: string;
  chainName: string;
  connect: () => Promise<void>;
  view(event: React.MouseEvent): void;
  walletProvider:
    | {
        context: CosmosKitChainContext;
        type: "cosmos-kit";
      }
    | {
        context: ReturnType<typeof useInterwovenKit>;
        type: "initia-widget";
      };
}

export const useCurrentChain = (): CurrentChain => {
  const {
    chainConfig: { chain, chainId, registryChainName },
  } = useCelatoneApp();
  const isInitia = useInitia();
  const cosmosKit = useChain(registryChainName);
  const interwovenKit = useInterwovenKit();

  if (isInitia) {
    return {
      address: zBechAddr20.optional().parse(interwovenKit.address || undefined),
      bech32Prefix: "init",
      chainId,
      chainName: chain,
      connect: async () => interwovenKit.openConnect(),
      view: () => interwovenKit.openWallet(),
      walletProvider: {
        context: interwovenKit,
        type: "initia-widget",
      },
    };
  }

  return {
    address: zBechAddr20.optional().parse(cosmosKit.address),
    bech32Prefix: cosmosKit.chain.bech32_prefix,
    chainId,
    chainName: cosmosKit.chain.chain_name,
    connect: async () => cosmosKit.connect(),
    view: () => cosmosKit.openView(),
    walletProvider: {
      context: cosmosKit,
      type: "cosmos-kit",
    },
  };
};
