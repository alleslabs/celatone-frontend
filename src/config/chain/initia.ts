import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

export const INITIA_CHAIN_CONFIGS: ChainConfigs = {
  "stone-9": {
    chain: "initia",
    registryChainName: "osmosis",
    prettyName: "Initia Testnet",
    // TODO change to initia
    lcd: "https://lcd.osmosis.zone",
    rpc: "https://rpc.osmosis.zone:443",
    indexer: "https://osmosis-mainnet-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: false,
      },
      wasm: {
        enabled: false,
      },
      move: {
        enabled: true,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "init",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://app.initia.tech/validator",
      proposal: "https://app.initia.tech/proposals",
    },
    extra: {},
  },
};
