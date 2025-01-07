import type { ChainConfig } from "@alleslabs/shared";
import { wallets as compassWallets } from "@cosmos-kit/compass";
import type { MainWalletBase } from "@cosmos-kit/core";
import { wallets as initiaWallets } from "@cosmos-kit/initia";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as staionWallets } from "@cosmos-kit/station";

export const getWallets = (wallets: ChainConfig["wallets"]) =>
  wallets.reduce((acc, wallet) => {
    switch (wallet) {
      case "compass":
        return [...acc, ...compassWallets];
      case "initia":
        return [...acc, ...initiaWallets];
      case "keplr":
        return [...acc, ...keplrWallets];
      case "station":
        return [...acc, ...staionWallets];
      default:
        return acc;
    }
  }, [] as MainWalletBase[]);

export const getRegistryChain = (config: ChainConfig) => ({
  $schema: "../chain.schema.json",
  bech32_prefix: config.registry?.bech32_prefix ?? "",
  chain_id: config.chainId,
  chain_name: config.registryChainName,
  fees: config.fees,
  logo_URIs: config.logo_URIs,
  network_type: config.network_type,
  pretty_name: config.prettyName,
  slip44: config.registry?.slip44 ?? 118,
  staking: config.registry?.staking,
  status: "live",
});

export const getRegistryAssets = (config: ChainConfig) => ({
  $schema: "../assetlist.schema.json",
  assets: config.registry?.assets ?? [],
  chain_name: config.registryChainName,
});
