import type { ChainConfig as SharedChainConfig } from "@alleslabs/shared";
import type { AssetList, Chain } from "@chain-registry/types";
import { wallets as compassWallets } from "@cosmos-kit/compass";
import { wallets as initiaWallets } from "@cosmos-kit/initia";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as staionWallets } from "@cosmos-kit/station";

import type { ChainConfig } from "config/chain";

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

export const populateChainConfig = (
  config: SharedChainConfig
): {
  chainConfig: ChainConfig;
  registryChain: Chain;
  registryAssets: AssetList;
} => ({
  chainConfig: {
    tier: config.tier,
    chain: config.chain,
    registryChainName: config.registryChainName,
    prettyName: config.prettyName,
    logoUrl:
      config.logo_URIs?.png ?? config.logo_URIs?.svg ?? config.logo_URIs?.jpeg,
    networkType: config.network_type,
    lcd: config.lcd,
    rpc: config.rpc,
    indexer: config.graphql || "",
    wallets: getWallets(config.wallets),
    features: config.features,
    gas: {
      gasPrice: {
        tokenPerGas: config.fees?.fee_tokens[0]?.fixed_min_gas_price ?? 0,
        denom: config.fees?.fee_tokens[0]?.denom ?? "",
      },
      gasAdjustment: config.gas.gasAdjustment,
      maxGasLimit: config.gas.maxGasLimit,
    },
    extra: config.extra,
  },
  registryChain: {
    chain_name: config.registryChainName,
    status: "live",
    network_type: config.network_type,
    pretty_name: config.prettyName,
    chain_id: config.chainId,
    bech32_prefix: config.registry?.bech32_prefix ?? "",
    slip44: config.registry?.slip44 ?? 118,
    fees: config.fees,
    staking: config.registry?.staking,
    logo_URIs: config.logo_URIs,
  },
  registryAssets: {
    $schema: "../assetlist.schema.json",
    chain_name: config.registryChainName,
    assets: config.registry?.assets ?? [],
  },
});
