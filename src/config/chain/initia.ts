import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

export const INITIA_CHAIN_CONFIGS: ChainConfigs = {
  "stone-11": {
    chain: "initia",
    registryChainName: "initiatestnet11",
    prettyName: "Initia Testnet 11",
    lcd: "https://stone-rest.initia.tech",
    rpc: "https://stone-rpc.initia.tech:443",
    indexer: "https://stone-11-graphql.alleslabs.dev/v1/graphql",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: true,
        url: process.env.NEXT_PUBLIC_INITIA_TESTNET_FAUCET_URL ?? "",
      },
      wasm: {
        enabled: false,
      },
      move: {
        enabled: true,
        moduleMaxFileSize: 1_048_576,
        decodeApi: "https://initia-api-jiod42ec2q-as.a.run.app/decode_module",
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
        enabled: true,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.151,
        denom: "uinit",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://app.initia.tech/validator",
      proposal: "https://app.initia.tech/proposal",
    },
    extra: {},
  },
  "stone-12": {
    chain: "initia",
    registryChainName: "initiatestnet12",
    prettyName: "Initia Testnet 12",
    lcd: "https://stone-12-rest.initia.tech",
    rpc: "https://stone-12-rpc.initia.tech:443",
    indexer: "https://stone-12-graphql.alleslabs.dev/v1/graphql",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: true,
        url: process.env.NEXT_PUBLIC_INITIA_TESTNET_FAUCET_URL ?? "",
      },
      wasm: {
        enabled: false,
      },
      move: {
        enabled: true,
        moduleMaxFileSize: 1_048_576,
        decodeApi: "https://initia-api-jiod42ec2q-as.a.run.app/decode_module",
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
        enabled: true,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.151,
        denom: "uinit",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://next.app.initia.tech/validator",
      proposal: "https://next.app.initia.tech/proposal",
    },
    extra: {},
  },
};
