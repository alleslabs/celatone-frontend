import type { ChainConfig } from "@alleslabs/shared";
import type { AssetList, Chain } from "@chain-registry/types";
import chainRegistry from "chain-registry";
import { isUndefined, unionBy } from "lodash";
import { useMemo } from "react";

import { devChainConfigs } from "config/chain";
import { SUPPORTED_CHAIN_IDS } from "env";
import { useLocalChainConfigStore } from "lib/providers/store";
import { useApiChainConfigs } from "lib/services/chain-config";
import { getRegistryAssets, getRegistryChain } from "lib/utils";

const defaultConfigs = {
  chainConfigs: {} as { [chainId: string]: ChainConfig },
  registryAssets: [] as AssetList[],
  registryChains: [] as Chain[],
  supportedChainIds: [] as string[],
};

export const useChainConfigs = (): {
  chainConfigs: { [chainId: string]: ChainConfig };
  isChainIdExist: (chainId: string) => boolean;
  isLoading: boolean;
  registryAssets: AssetList[];
  registryChains: Chain[];
  supportedChainIds: string[];
} => {
  const { data: apiChainConfigs, isFetching } =
    useApiChainConfigs(SUPPORTED_CHAIN_IDS);
  const { isHydrated, localChainConfigs } = useLocalChainConfigStore();

  const api = useMemo(() => {
    if (isFetching || isUndefined(apiChainConfigs)) return defaultConfigs;

    return apiChainConfigs.reduce(
      (acc, each) => ({
        chainConfigs: {
          ...acc.chainConfigs,
          [each.chainId]: each,
        },
        registryAssets: [...acc.registryAssets, getRegistryAssets(each)],
        registryChains: [...acc.registryChains, getRegistryChain(each)],
        supportedChainIds: [...acc.supportedChainIds, each.chainId],
      }),
      defaultConfigs
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(apiChainConfigs), isFetching]);

  const local = useMemo(
    () =>
      Object.values(localChainConfigs).reduce(
        (acc, each) => ({
          chainConfigs: {
            ...acc.chainConfigs,
            [each.chainId]: each,
          },
          registryAssets: [...acc.registryAssets, getRegistryAssets(each)],
          registryChains: [...acc.registryChains, getRegistryChain(each)],
          supportedChainIds: [...acc.supportedChainIds, each.chainId],
        }),
        defaultConfigs
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(localChainConfigs)]
  );

  const dev = useMemo(
    () =>
      devChainConfigs.reduce(
        (acc, each) =>
          SUPPORTED_CHAIN_IDS.includes(each.chainId)
            ? {
                chainConfigs: {
                  ...acc.chainConfigs,
                  [each.chainId]: each,
                },
                registryAssets: [
                  ...acc.registryAssets,
                  getRegistryAssets(each),
                ],
                registryChains: [...acc.registryChains, getRegistryChain(each)],
                supportedChainIds: [...acc.supportedChainIds, each.chainId],
              }
            : acc,
        defaultConfigs
      ),
    []
  );

  return useMemo(() => {
    const chainConfigs = {
      ...api.chainConfigs,
      ...local.chainConfigs,
      ...dev.chainConfigs,
    };

    return {
      chainConfigs,
      isChainIdExist: (chainId: string) => !!chainConfigs[chainId],
      isLoading: isFetching || !isHydrated,
      registryAssets: unionBy(
        chainRegistry.assets,
        api.registryAssets,
        local.registryAssets,
        dev.registryAssets,
        "chain_name"
      ),
      registryChains: unionBy(
        chainRegistry.chains,
        api.registryChains,
        local.registryChains,
        dev.registryChains,
        "chain_id"
      ),
      supportedChainIds: [...SUPPORTED_CHAIN_IDS, ...local.supportedChainIds],
    };
  }, [
    api.chainConfigs,
    api.registryAssets,
    api.registryChains,
    dev.chainConfigs,
    dev.registryAssets,
    dev.registryChains,
    isFetching,
    isHydrated,
    local.chainConfigs,
    local.registryAssets,
    local.registryChains,
    local.supportedChainIds,
  ]);
};
