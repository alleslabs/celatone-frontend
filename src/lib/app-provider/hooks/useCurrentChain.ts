import type { ChainContext as CosmosKitChainContext } from "@cosmos-kit/core";
import type { ReactWalletWidget as InitiaWidget } from "@initia/react-wallet-widget/dist/types";
import type { BechAddr20, Option } from "lib/types";

import { useChain } from "@cosmos-kit/react";
import { useWallet } from "@initia/react-wallet-widget/ssr";
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
        context: InitiaWidget;
        type: "initia-widget";
      };
}

export const useCurrentChain = (): CurrentChain => {
  const {
    chainConfig: { chain, chainId, registryChainName },
  } = useCelatoneApp();
  const isInitia = useInitia();
  const cosmosKit = useChain(registryChainName);
  const initiaWidget = useWallet();

  if (isInitia) {
    return {
      address: zBechAddr20
        .optional()
        .parse(initiaWidget.account?.address ?? undefined),
      bech32Prefix: "init",
      chainId,
      chainName: chain,
      connect: async () => initiaWidget.onboard(),
      view: (event) => initiaWidget.view(event),
      walletProvider: {
        context: initiaWidget,
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
