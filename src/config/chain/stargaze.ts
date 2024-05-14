import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

export const STARGAZE_CHAIN_CONFIGS: ChainConfigs = {
  "stargaze-1": {
    tier: "full",
    chain: "stargaze",
    registryChainName: "stargaze",
    prettyName: "Stargaze",
    lcd: "https://rest.stargaze-apis.com",
    rpc: "https://rpc.stargaze-apis.com:443",
    indexer: "https://stargaze-mainnet-graphql.alleslabs.dev/v1/graphql",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: false,
      },
      wasm: {
        enabled: true,
        storeCodeMaxFileSize: 800_000,
        clearAdminGas: 50_000,
      },
      move: {
        enabled: false,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: true,
        version: "v1",
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 1.1,
        denom: "ustars",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {},
  },
  "elgafar-1": {
    tier: "full",
    chain: "stargaze",
    registryChainName: "stargazetestnet",
    prettyName: "Stargaze Testnet",
    lcd: "https://rest.elgafar-1.stargaze-apis.com",
    rpc: "https://rpc.elgafar-1.stargaze-apis.com",
    indexer: "https://elgafar-1-graphql.alleslabs.dev/v1/graphql",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: false,
      },
      wasm: {
        enabled: true,
        storeCodeMaxFileSize: 800_000,
        clearAdminGas: 50_000,
      },
      move: {
        enabled: false,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: true,
        version: "v1",
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.04,
        denom: "ustars",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 50_000_000,
    },
    extra: {},
  },
};
