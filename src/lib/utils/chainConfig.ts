import type { ChainConfig } from "@alleslabs/shared";
import { wallets as compassWallets } from "@cosmos-kit/compass";
import type { MainWalletBase } from "@cosmos-kit/core";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";

export const getWallets = (wallets: ChainConfig["wallets"]) =>
  wallets.reduce((acc, wallet) => {
    switch (wallet) {
      case "keplr":
        return [...acc, ...keplrWallets];
      case "compass":
        return [...acc, ...compassWallets];
      default:
        return acc;
    }
  }, [] as MainWalletBase[]);

export const getRegistryChain = (config: ChainConfig) => ({
  $schema: "../chain.schema.json",
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
});

export const getRegistryAssets = (config: ChainConfig) => ({
  $schema: "../assetlist.schema.json",
  chain_name: config.registryChainName,
  assets: config.registry?.assets ?? [],
});
