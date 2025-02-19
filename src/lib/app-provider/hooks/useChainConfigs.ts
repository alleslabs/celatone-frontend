import type { ChainConfig } from "@alleslabs/shared";
import type { AssetList, Chain } from "@chain-registry/types";
import chainRegistry from "chain-registry";
import { isUndefined, unionBy } from "lodash";
import { useMemo } from "react";

import { devChainConfigs } from "config/chain";
import { useLocalChainConfigStore } from "lib/providers/store";
import { useApiChainConfigs } from "lib/services/chain-config";
import { getRegistryAssets, getRegistryChain } from "lib/utils";
import { CHAIN, SUPPORTED_NETWORK_TYPES } from "env";

const defaultConfigs = {
  chainConfigs: {} as { [chainId: string]: ChainConfig },
  registryChains: [] as Chain[],
  registryAssets: [] as AssetList[],
  supportedChainIds: [] as string[],
};

export const useChainConfigs = (): {
  chainConfigs: { [chainId: string]: ChainConfig };
  registryChains: Chain[];
  registryAssets: AssetList[];
  supportedChainIds: string[];
  isChainIdExist: (chainId: string) => boolean;
  isLoading: boolean;
} => {
  const { data: apiChainConfigs, isFetching } = useApiChainConfigs(
    SUPPORTED_NETWORK_TYPES,
    CHAIN
  );
  const { localChainConfigs, isHydrated } = useLocalChainConfigStore();

  const api = useMemo(() => {
    if (isFetching || isUndefined(apiChainConfigs)) return defaultConfigs;

    const sortedApiChainConfigs = apiChainConfigs.sort((a, b) => {
      const networkOrderA = a.network_type === "mainnet" ? 0 : 1;
      const networkOrderB = b.network_type === "mainnet" ? 0 : 1;
      if (networkOrderA !== networkOrderB) {
        return networkOrderA - networkOrderB;
      }

      const layerOrderA = a.extra?.layer === "1" ? 0 : 1;
      const layerOrderB = b.extra?.layer === "1" ? 0 : 1;
      if (layerOrderA !== layerOrderB) {
        return layerOrderA - layerOrderB;
      }

      const chainCompared = a.chain.localeCompare(b.chain);
      if (chainCompared !== 0) {
        return chainCompared;
      }

      return a.prettyName.localeCompare(b.prettyName);
    });

    return sortedApiChainConfigs.reduce(
      (acc, each) => ({
        chainConfigs: {
          ...acc.chainConfigs,
          [each.chainId]: each,
        },
        registryChains: [...acc.registryChains, getRegistryChain(each)],
        registryAssets: [...acc.registryAssets, getRegistryAssets(each)],
        supportedChainIds: [...acc.supportedChainIds, each.chainId],
      }),
      defaultConfigs
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(apiChainConfigs), isFetching]);

  const custom = useMemo(
    () =>
      Object.values(localChainConfigs).reduce(
        (acc, each) => ({
          chainConfigs: {
            ...acc.chainConfigs,
            [each.chainId]: each,
          },
          registryChains: [...acc.registryChains, getRegistryChain(each)],
          registryAssets: [...acc.registryAssets, getRegistryAssets(each)],
          supportedChainIds: [...acc.supportedChainIds, each.chainId],
        }),
        defaultConfigs
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(localChainConfigs)]
  );

  const local = useMemo(
    () =>
      SUPPORTED_NETWORK_TYPES.includes("local")
        ? devChainConfigs.reduce(
            (acc, each) => ({
              chainConfigs: {
                ...acc.chainConfigs,
                [each.chainId]: each,
              },
              registryChains: [...acc.registryChains, getRegistryChain(each)],
              registryAssets: [...acc.registryAssets, getRegistryAssets(each)],
              supportedChainIds: [...acc.supportedChainIds, each.chainId],
            }),
            defaultConfigs
          )
        : defaultConfigs,
    []
  );

  return useMemo(() => {
    const chainConfigs = {
      ...api.chainConfigs,
      ...custom.chainConfigs,
      ...local.chainConfigs,
    };

    return {
      chainConfigs,
      registryChains: unionBy(
        chainRegistry.chains,
        api.registryChains,
        custom.registryChains,
        local.registryChains,
        "chain_id"
      ),
      registryAssets: unionBy(
        chainRegistry.assets,
        api.registryAssets,
        custom.registryAssets,
        local.registryAssets,
        "chain_name"
      ),
      supportedChainIds: [
        ...api.supportedChainIds,
        ...custom.supportedChainIds,
        ...local.supportedChainIds,
      ],
      isChainIdExist: (chainId: string) => !!chainConfigs[chainId],
      isLoading: isFetching || !isHydrated,
    };
  }, [
    api.chainConfigs,
    api.registryChains,
    api.registryAssets,
    api.supportedChainIds,
    custom.chainConfigs,
    custom.registryChains,
    custom.registryAssets,
    custom.supportedChainIds,
    local.chainConfigs,
    local.registryChains,
    local.registryAssets,
    local.supportedChainIds,
    isFetching,
    isHydrated,
  ]);
};
