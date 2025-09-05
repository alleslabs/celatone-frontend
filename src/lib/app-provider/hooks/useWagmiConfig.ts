import type { Chain } from "wagmi/chains";

import { initiaPrivyWalletConnector } from "@initia/interwovenkit-react";
import { useEvmParams } from "lib/services/evm";
import { convertCosmosChainIdToEvmChainId } from "lib/utils";
import { useMemo } from "react";
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";

import { useCelatoneApp } from "../contexts";

const defaultWagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [initiaPrivyWalletConnector],
  transports: { [mainnet.id]: http() },
});

export const useWagmiConfig = () => {
  const {
    chainConfig: {
      features: { evm },
      prettyName,
      registry,
    },
    currentChainId,
  } = useCelatoneApp();
  const { data: evmParams } = useEvmParams();

  return useMemo(() => {
    if (evm.enabled) {
      const evmChainId = convertCosmosChainIdToEvmChainId(currentChainId);
      const feeDenom = evmParams?.params?.feeDenom.slice(-40) ?? "";

      const foundAsset = registry?.assets?.find((asset) =>
        asset.denom_units.find(
          (denomUnit) => denomUnit.denom.slice(-40) === feeDenom
        )
      );
      if (!foundAsset) {
        return defaultWagmiConfig;
      }

      const denomUnit = foundAsset.denom_units.reduce((max, unit) =>
        unit.exponent > max.exponent ? unit : max
      );

      const customChain: Chain = {
        id: evmChainId,
        name: prettyName,
        nativeCurrency: {
          decimals: denomUnit.exponent,
          name: foundAsset.name,
          symbol: foundAsset.symbol,
        },
        rpcUrls: {
          default: { http: [evm.jsonRpc] },
        },
      };

      return createConfig({
        chains: [mainnet, customChain],
        connectors: [initiaPrivyWalletConnector],
        transports: { [customChain.id]: http(), [mainnet.id]: http() },
      });
    }
    return defaultWagmiConfig;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChainId, evmParams]);
};
