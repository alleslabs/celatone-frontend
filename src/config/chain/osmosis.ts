import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

export const OSMOSIS_CHAIN_CONFIGS: ChainConfigs = {
  "osmosis-1": {
    tier: "full",
    chain: "osmosis",
    registryChainName: "osmosis",
    prettyName: "Osmosis",
    lcd: "https://lcd.osmosis.zone",
    rpc: "https://rpc.osmosis.zone:443",
    indexer: "https://osmosis-1-graphql.alleslabs.dev/v1/graphql",
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
        enabled: true,
        url: "https://app.osmosis.zone/pool",
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: true,
        version: "v1",
        disableStoreCodeProposal: true,
        disableWhitelistProposal: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {},
  },
  "osmo-test-5": {
    tier: "full",
    chain: "osmosis",
    registryChainName: "osmosistestnet",
    prettyName: "Osmosis Testnet",
    lcd: "https://lcd.osmotest5.osmosis.zone",
    rpc: "https://osmosis-testnet-rpc.polkachu.com:443",
    indexer: "",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: true,
        url: process.env.NEXT_PUBLIC_OSMOSIS_TESTNET_FAUCET_URL ?? "",
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
        enabled: true,
        url: "https://testnet.osmosis.zone/pool",
      },
      publicProject: {
        enabled: false,
      },
      gov: {
        enabled: true,
        version: "v1",
        disableWhitelistProposal: true,
        disableStoreCodeProposal: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {},
  },
  localosmosis: {
    tier: "full",
    chain: "osmosis",
    registryChainName: "localosmosis",
    prettyName: "Local Osmosis",
    lcd: "http://localhost/rest",
    rpc: "http://localhost:80/rpc/",
    indexer: "http://localhost/hasura/v1/graphql",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: true,
        url: "http://localhost:5005/request",
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
        version: "v1",
        disableWhitelistProposal: true,
        disableStoreCodeProposal: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.25,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {},
  },
};
