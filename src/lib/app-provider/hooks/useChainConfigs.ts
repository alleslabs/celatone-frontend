import type { AssetList, Chain } from "@chain-registry/types";
import { assets, chains } from "chain-registry";
import { find, isUndefined } from "lodash";
import { useCallback, useMemo } from "react";

import type { ChainConfigs } from "config/chain";
import { CHAIN_CONFIGS } from "config/chain";
import { SUPPORTED_CHAIN_IDS } from "env";
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
} => {
  const { data: apiChainConfigs, isLoading } =
    useApiChainConfigs(SUPPORTED_CHAIN_IDS);
  const { localChainConfigs, isLocalChainIdExist, isLocalPrettyNameExist } =
    useLocalChainConfigStore();

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

  const isChainIdExist = useCallback(
    (chainId: string) =>
      !!CHAIN_CONFIGS[chainId] || isLocalChainIdExist(chainId),
    [isLocalChainIdExist]
  );

  const isPrettyNameExist = useCallback(
    (name: string) =>
      !!find(CHAIN_CONFIGS, { prettyName: name }) ||
      isLocalPrettyNameExist(name),
    [isLocalPrettyNameExist]
  );

  return {
    chainConfigs: {
      ...api.chainConfigs,
      ...local.chainConfigs,
    },
    registryChains: [
      ...chains,
      localosmosis,
      sei,
      terra2testnet,
      ...initiatestnet,
      ...local.registryChains,
    ],
    registryAssets: [
      ...assets,
      localosmosisAsset,
      seiAssets,
      terra2testnetAssets,
      ...initiatestnetAssets,
      ...local.registryAssets,
    ],
    supportedChainIds: [...SUPPORTED_CHAIN_IDS, ...local.supportedChainIds],
    isChainIdExist,
    isPrettyNameExist,
  };
};
