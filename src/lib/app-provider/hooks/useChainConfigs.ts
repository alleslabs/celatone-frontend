/* eslint-disable sonarjs/no-duplicate-string */
import type { ChainConfig as SharedChainConfig } from "@alleslabs/shared";
import type { AssetList, Chain } from "@chain-registry/types";
import { wallets as compassWallets } from "@cosmos-kit/compass";
import { wallets as initiaWallets } from "@cosmos-kit/initia";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as staionWallets } from "@cosmos-kit/station";
import { assets, chains } from "chain-registry";
import { find } from "lodash";
import { useCallback, useMemo } from "react";

import type { ChainConfig, ChainConfigs } from "config/chain";
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

const getWallets = (wallets: SharedChainConfig["wallets"]) =>
  wallets.reduce(
    (acc, wallet) => {
      switch (wallet) {
        case "keplr":
          return [...acc, ...keplrWallets];
        case "initia":
          return [...acc, ...initiaWallets];
        case "compass":
          return [...acc, ...compassWallets];
        case "station":
          return [...acc, ...staionWallets];
        default:
          return acc;
      }
    },
    [] as ChainConfig["wallets"]
  );

export const useChainConfigs = (): {
  chainConfigs: ChainConfigs;
  registryChains: Chain[];
  registryAssets: AssetList[];
  supportedChainIds: string[];
  isChainIdExist: (chainId: string) => boolean;
  isPrettyNameExist: (name: string) => boolean;
} => {
  const { localChainConfigs, isLocalChainIdExist, isLocalPrettyNameExist } =
    useLocalChainConfigStore();

  const local = useMemo(
    () =>
      Object.values(localChainConfigs).reduce(
        (acc, each) => {
          const localChainConfig: ChainConfig = {
            tier: each.tier,
            chain: each.chain,
            registryChainName: each.registryChainName,
            prettyName: each.prettyName,
            logoUrl:
              each.logo_URIs?.png ??
              each.logo_URIs?.svg ??
              each.logo_URIs?.jpeg,
            networkType: each.network_type,
            lcd: each.lcd,
            rpc: each.rpc,
            indexer: each.graphql || "",
            wallets: getWallets(each.wallets),
            features: each.features,
            gas: {
              gasPrice: {
                tokenPerGas: each.fees?.fee_tokens[0]?.fixed_min_gas_price ?? 0,
                denom: each.fees?.fee_tokens[0]?.denom ?? "",
              },
              gasAdjustment: each.gas.gasAdjustment,
              maxGasLimit: each.gas.maxGasLimit,
            },
            extra: each.extra,
          };

          const localRegistryChain: Chain = {
            chain_name: each.registryChainName,
            status: "live",
            network_type: each.network_type,
            pretty_name: each.prettyName,
            chain_id: each.chainId,
            bech32_prefix: each.registry?.bech32_prefix ?? "",
            slip44: each.registry?.slip44 ?? 118,
            fees: each.fees,
            staking: each.registry?.staking,
            logo_URIs: each.logo_URIs,
          };

          const localRegistryAssets: AssetList = {
            $schema: "../assetlist.schema.json",
            chain_name: each.registryChainName,
            assets: each.registry?.assets ?? [],
          };

          return {
            chainConfigs: {
              ...acc.chainConfigs,
              [each.chainId]: localChainConfig,
            },
            registryChains: [...acc.registryChains, localRegistryChain],
            registryAssets: [...acc.registryAssets, localRegistryAssets],
            supportedChainIds: [...acc.supportedChainIds, each.chainId],
          };
        },
        {
          chainConfigs: {} as ChainConfigs,
          registryChains: [] as Chain[],
          registryAssets: [] as AssetList[],
          supportedChainIds: [] as string[],
        }
      ),
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
      ...CHAIN_CONFIGS,
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
