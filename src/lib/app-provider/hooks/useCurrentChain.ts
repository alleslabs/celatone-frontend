import type { ChainContext as CosmosKitChainContext } from "@cosmos-kit/core";
import { useChain } from "@cosmos-kit/react";
import type { ReactWalletWidget as InitiaWidget } from "@initia/react-wallet-widget/dist/types";
import { useWallet } from "@initia/react-wallet-widget/ssr";

import { zBechAddr20 } from "lib/types";
import type { BechAddr20, Option } from "lib/types";

import { useInitia } from "./useInitia";
import { useCelatoneApp } from "../contexts";

interface CurrentChain {
  bech32Prefix: string;
  chainId: string;
  chainName: string;
  address: Option<BechAddr20>;
  connect: () => Promise<void>;
  view(event: React.MouseEvent): void;
  walletProvider:
    | {
        type: "cosmos-kit";
        context: CosmosKitChainContext;
      }
    | {
        type: "initia-widget";
        context: InitiaWidget;
      };
}

export const useCurrentChain = (): CurrentChain => {
  const {
    chainConfig: { registryChainName, chainId, chain },
  } = useCelatoneApp();
  const isInitia = useInitia();
  const cosmosKit = useChain(registryChainName);
  const initiaWidget = useWallet();

  if (isInitia) {
    return {
      bech32Prefix: "init",
      chainId,
      chainName: chain,
      address: zBechAddr20
        .optional()
        .parse(initiaWidget.account?.address ?? undefined),
      connect: async () => initiaWidget.onboard(),
      view: (event) => initiaWidget.view(event),
      walletProvider: {
        type: "initia-widget",
        context: initiaWidget,
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
      type: "cosmos-kit",
      context: cosmosKit,
    },
  };
};
