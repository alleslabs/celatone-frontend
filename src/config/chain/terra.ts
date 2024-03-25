import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as staionWallets } from "@cosmos-kit/station";

import type { ChainConfigs } from "./types";

export const TERRA_CHAIN_CONFIGS: ChainConfigs = {
  "phoenix-1": {
    chain: "terra",
    registryChainName: "terra2",
    prettyName: "Terra",
    lcd: "https://phoenix-lcd.terra.dev:443",
    rpc: "https://terra2-rpc.lavenderfive.com:443",
    indexer: "https://phoenix-1-legacy-graphql.alleslabs.dev/v1/graphql",
    wallets: [...staionWallets, ...keplrWallets],
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
        hideOpenProposal: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.0151,
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
    wallets: [...staionWallets, ...keplrWallets],
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
        enabled: false,
      },
      gov: {
        enabled: true,
        hideOpenProposal: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.151,
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
