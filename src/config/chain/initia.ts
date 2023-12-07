/* eslint-disable sonarjs/no-duplicate-string */
import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

const moveDecoderApi =
  "https://initia-api-jiod42ec2q-as.a.run.app/decode_module";

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
        decodeApi: moveDecoderApi,
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
  "stone-12-1": {
    chain: "initia",
    registryChainName: "initiatestnet12-1",
    prettyName: "Initia Testnet 12-1",
    lcd: "https://next-stone-rest.initia.tech",
    rpc: "https://next-stone-rpc.initia.tech:443",
    indexer: "https://stone-12-1-graphql.alleslabs.dev/v1/graphql",
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
        decodeApi: moveDecoderApi,
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
  "game-3": {
    chain: "initia",
    registryChainName: "game3",
    prettyName: "Marketplace Minitia",
    lcd: "https://game-3-minitia-rest.initia.tech",
    rpc: "https://game-3-minitia-rpc.initia.tech",
    indexer: "https://game-3-graphql.alleslabs.dev/v1/graphql",
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
        moduleMaxFileSize: 1_048_576,
        decodeApi: moveDecoderApi,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: false,
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
    extra: { disableDelegation: true },
  },
  "free-3": {
    chain: "initia",
    registryChainName: "free3",
    prettyName: "Free Minitia",
    lcd: "https://free-3-minitia-rest.initia.tech",
    rpc: "https://free-3-minitia-rpc.initia.tech",
    indexer: "https://free-3-graphql.alleslabs.dev/v1/graphql",
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
        moduleMaxFileSize: 1_048_576,
        decodeApi: moveDecoderApi,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: false,
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
    extra: { disableDelegation: true },
  },
  "wasm-3": {
    chain: "initia",
    registryChainName: "wasm3",
    prettyName: "Wasm Minitia",
    lcd: "https://wasm-3-minitia-rest.initia.tech",
    rpc: "https://wasm-3-minitia-rpc.initia.tech",
    indexer: "https://wasm-3-graphql.alleslabs.dev/v1/graphql",
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
        moduleMaxFileSize: 1_048_576,
        decodeApi: moveDecoderApi,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: false,
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
    extra: { disableDelegation: true },
  },
};
