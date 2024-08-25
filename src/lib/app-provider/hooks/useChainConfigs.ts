import type { AssetList, Chain } from "@chain-registry/types";
import chainRegistry from "chain-registry";
import { find, isUndefined, unionBy } from "lodash";
import { useCallback, useMemo } from "react";

import { devChainConfigs } from "config/chain";
import type { ChainConfigs } from "config/chain";
import { SUPPORTED_CHAIN_IDS } from "env";
import { useLocalChainConfigStore } from "lib/providers/store";
import { useApiChainConfigs } from "lib/services/chain-config";
import { populateChainConfig } from "lib/utils/chain-config";

const defaultConfigs = {
  chainConfigs: {} as ChainConfigs,
  registryChains: [] as Chain[],
  registryAssets: [] as AssetList[],
  supportedChainIds: [] as string[],
};

export const useChainConfigs = (): {
  chainConfigs: ChainConfigs;
  registryChains: Chain[];
  registryAssets: AssetList[];
  supportedChainIds: string[];
  isChainIdExist: (chainId: string) => boolean;
  isPrettyNameExist: (name: string) => boolean;
  isLoading: boolean;
} => {
  const {
    data: apiChainConfigs,
    isLoading,
    isFetching,
  } = useApiChainConfigs(SUPPORTED_CHAIN_IDS);
  const {
    localChainConfigs,
    isLocalChainIdExist,
    isLocalPrettyNameExist,
    isHydrated,
  } = useLocalChainConfigStore();

  const api = useMemo(() => {
    if (isLoading || isUndefined(apiChainConfigs)) return defaultConfigs;

    return apiChainConfigs.reduce((acc, each) => {
      const { chainConfig, registryChain, registryAssets } =
        populateChainConfig(each);

      return {
        chainConfigs: {
          ...acc.chainConfigs,
          [each.chainId]: chainConfig,
        },
        registryChains: [...acc.registryChains, registryChain],
        registryAssets: [...acc.registryAssets, registryAssets],
        supportedChainIds: [...acc.supportedChainIds, each.chainId],
      };
    }, defaultConfigs);
  }, [apiChainConfigs, isLoading]);

  const local = useMemo(
    () =>
      Object.values(localChainConfigs).reduce((acc, each) => {
        const { chainConfig, registryChain, registryAssets } =
          populateChainConfig(each);

        return {
          chainConfigs: {
            ...acc.chainConfigs,
            [each.chainId]: chainConfig,
          },
          registryChains: [...acc.registryChains, registryChain],
          registryAssets: [...acc.registryAssets, registryAssets],
          supportedChainIds: [...acc.supportedChainIds, each.chainId],
        };
      }, defaultConfigs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(localChainConfigs)]
  );

  const dev = useMemo(
    () =>
      Object.values(devChainConfigs).reduce((acc, each) => {
        const { chainConfig, registryChain, registryAssets } =
          populateChainConfig(each);

        return {
          chainConfigs: {
            ...acc.chainConfigs,
            [each.chainId]: chainConfig,
          },
          registryChains: [...acc.registryChains, registryChain],
          registryAssets: [...acc.registryAssets, registryAssets],
          supportedChainIds: [...acc.supportedChainIds, each.chainId],
        };
      }, defaultConfigs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(localChainConfigs)]
  );

  const isChainIdExist = useCallback(
    (chainId: string) =>
      !!api.chainConfigs[chainId] || isLocalChainIdExist(chainId),
    [api.chainConfigs, isLocalChainIdExist]
  );

  const isPrettyNameExist = useCallback(
    (name: string) =>
      !!find(apiChainConfigs, { prettyName: name }) ||
      isLocalPrettyNameExist(name),
    [apiChainConfigs, isLocalPrettyNameExist]
  );

  return {
    chainConfigs: {
      ...api.chainConfigs,
      ...local.chainConfigs,
      ...dev.chainConfigs,
    },
    registryChains: unionBy(
      chainRegistry.chains,
      api.registryChains,
      local.registryChains,
      dev.registryChains,
      "chain_id"
    ),
    registryAssets: unionBy(
      chainRegistry.assets,
      api.registryAssets,
      local.registryAssets,
      dev.registryAssets,
      "chain_name"
    ),
    supportedChainIds: [...SUPPORTED_CHAIN_IDS, ...local.supportedChainIds],
    isChainIdExist,
    isPrettyNameExist,
    isLoading: (isLoading && isFetching) || !isHydrated,
  };
};
