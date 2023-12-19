import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

const INITIA_DECODER =
  "https://initia-api-jiod42ec2q-as.a.run.app/decode_module";

export const INITIA_CHAIN_CONFIGS: ChainConfigs = {
  "mahalo-1": {
    chain: "initia",
    registryChainName: "initiadevnet1",
    prettyName: "Initia Devnet 1",
    lcd: "https://lcd.mahalo-1.initia.xyz",
    rpc: "https://rpc.mahalo-1.initia.xyz:443",
    indexer: "https://mahalo-1-graphql.alleslabs.dev/v1/graphql",
    wallets: [...keplrWallets],
    features: {
      faucet: {
        enabled: true,
        url: process.env.NEXT_PUBLIC_INITIA_DEVNET_FAUCET_URL ?? "",
      },
      wasm: {
        enabled: false,
      },
      move: {
        enabled: true,
        moduleMaxFileSize: 1_048_576,
        decodeApi: INITIA_DECODER,
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
      validator: "https://app.initia.xyz/validator",
      proposal: "https://app.initia.xyz/proposal",
    },
    extra: {},
  },
  "minimove-1": {
    chain: "initia",
    registryChainName: "minitiamovedevnet1",
    prettyName: "Minitia Move Devnet 1",
    lcd: "https://lcd.minimove-1.initia.xyz",
    rpc: "https://rpc.minimove-1.initia.xyz:443",
    indexer: "https://minimove-1-graphql.alleslabs.dev/v1/graphql",
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
        decodeApi: INITIA_DECODER,
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
        denom: "umin",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "",
      proposal: "",
    },
    extra: { disableDelegation: true },
  },
  "miniwasm-1": {
    chain: "initia",
    registryChainName: "minitiawasmdevnet1",
    prettyName: "Minitia Wasm Devnet 1",
    lcd: "https://lcd.miniwasm-1.initia.xyz",
    rpc: "https://rpc.miniwasm-1.initia.xyz:443",
    indexer: "https://miniwasm-1-graphql.alleslabs.dev/v1/graphql",
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
        enabled: false,
      },
      nft: {
        enabled: true,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.151,
        denom: "umin",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "",
      proposal: "",
    },
    extra: { disableDelegation: true },
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
        decodeApi: INITIA_DECODER,
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
