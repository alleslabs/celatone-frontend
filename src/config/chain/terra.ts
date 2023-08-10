import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

export const TERRA_CHAIN_CONFIGS: ChainConfigs = {
  "phoenix-1": {
    chain: "terra",
    registryChainName: "terra2",
    prettyName: "Terra",
    lcd: "https://phoenix-lcd.terra.dev:443",
    rpc: "https://terra-rpc.polkachu.com",
    indexer: "https://phoenix-1-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
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
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      proposal: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.0125,
        denom: "uluna",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://finder.terra.money/mainnet/validator",
      proposal: "https://station.terra.money/proposal/phoenix-1",
    },
    extra: {},
  },
  "pisco-1": {
    chain: "terra",
    registryChainName: "terra2testnet",
    prettyName: "Terra Testnet",
    lcd: "https://pisco-lcd.terra.dev:443",
    rpc: "https://terra-testnet-rpc.polkachu.com:443",
    indexer: "https://pisco-1-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
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
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: false,
      },
      proposal: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.0125,
        denom: "uluna",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://finder.terra.money/testnet/validator",
      proposal: "https://station.terra.money/proposal/pisco-1",
    },
    extra: {},
  },
};
