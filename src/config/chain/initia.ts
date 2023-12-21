import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

export const INITIA_CHAIN_CONFIGS: ChainConfigs = {
  "stone-12-1": {
    chain: "initia",
    registryChainName: "initiatestnet12-1",
    prettyName: "Initia Testnet 12-1",
    lcd: "https://next-stone-rest.initia.tech",
    rpc: "https://next-stone-rpc.initia.tech:443",
    indexer: "https://stone-12-1-nft-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
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
        hideOpenProposal: true,
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
