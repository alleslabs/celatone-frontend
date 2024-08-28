import type { ChainConfig } from "@alleslabs/shared";
import type { AssetList, Chain } from "@chain-registry/types";
import chainRegistry from "chain-registry";
import { find, isUndefined, unionBy } from "lodash";
import { useMemo } from "react";

import { devChainConfigs } from "config/chain";
import { SUPPORTED_CHAIN_IDS } from "env";
import { useLocalChainConfigStore } from "lib/providers/store";
import { useApiChainConfigs } from "lib/services/chain-config";
import { getRegistryAssets, getRegistryChain } from "lib/utils";

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
  isPrettyNameExist: (name: string) => boolean;
  isLoading: boolean;
} => {
  const { data: apiChainConfigs, isFetching } =
    useApiChainConfigs(SUPPORTED_CHAIN_IDS);
  const { localChainConfigs, isHydrated } = useLocalChainConfigStore();

  const api = useMemo(() => {
    if (isFetching || isUndefined(apiChainConfigs)) return defaultConfigs;

    return apiChainConfigs.reduce(
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

  const local = useMemo(
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
                registryChains: [...acc.registryChains, getRegistryChain(each)],
                registryAssets: [
                  ...acc.registryAssets,
                  getRegistryAssets(each),
                ],
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
      isChainIdExist: (chainId: string) => !!chainConfigs[chainId],
      isPrettyNameExist: (name: string) =>
        !!find(chainConfigs, { prettyName: name }),
      isLoading: isFetching || !isHydrated,
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
