import { wallets as initiaWallets } from "@cosmos-kit/initia";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

const INITIA_DECODER =
  "https://initia-api-jiod42ec2q-as.a.run.app/decode_module";

export const INITIA_CHAIN_CONFIGS: ChainConfigs = {
  "mahalo-2": {
    chain: "initia",
    registryChainName: "initiadevnet2",
    prettyName: "Initia Closed Testnet 2",
    lcd: "https://lcd.mahalo-2.initia.xyz",
    rpc: "https://rpc.mahalo-2.initia.xyz:443",
    indexer: "https://mahalo-2-graphql.alleslabs.dev/v1/graphql",
    wallets: [...initiaWallets, ...keplrWallets],
    features: {
      faucet: {
        enabled: false,
        // url: process.env.NEXT_PUBLIC_INITIA_DEVNET_FAUCET_URL ?? "",
      },
      wasm: {
        enabled: false,
      },
      move: {
        enabled: true,
        moduleMaxFileSize: 1_048_576,
        decodeApi: INITIA_DECODER,
        verify: "https://compiler.mahalo-1.initia.xyz/contracts/verify",
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
    extra: {},
  },
  "minimove-2": {
    chain: "initia",
    registryChainName: "minitiamovedevnet2",
    prettyName: "Minitia Move Closed Testnet 2",
    lcd: "https://lcd.minimove-2.initia.xyz",
    rpc: "https://rpc.minimove-2.initia.xyz:443",
    indexer: "https://minimove-2-graphql.alleslabs.dev/v1/graphql",
    wallets: [...initiaWallets, ...keplrWallets],
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
        verify: "",
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
        denom:
          "l2/4b66eb60bf9f503ea97fe4dc96d5c604c1dca14ee988e21510ac4b087bf72671",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {},
  },
  "miniwasm-2": {
    chain: "initia",
    registryChainName: "minitiawasmdevnet2",
    prettyName: "Minitia Wasm Closed Testnet 2",
    lcd: "https://lcd.miniwasm-2.initia.xyz",
    rpc: "https://rpc.miniwasm-2.initia.xyz:443",
    indexer: "https://miniwasm-2-graphql.alleslabs.dev/v1/graphql",
    wallets: [...initiaWallets, ...keplrWallets],
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
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.151,
        denom:
          "l2/926dab95dc14918344374867b8576adee2c6cfca69b968fdb08c5280390cd1a7",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {},
  },
  "stone-13": {
    chain: "initia",
    registryChainName: "initiatestnet13",
    prettyName: "Initia Testnet 13",
    lcd: "https://lcd.stone-13.initia.xyz",
    rpc: "https://rpc.stone-13.initia.xyz:443",
    indexer: "https://stone-13-graphql.alleslabs.dev/v1/graphql",
    wallets: [...initiaWallets, ...keplrWallets],
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
        verify: "https://stone-compiler.initia.tech/contracts/verify",
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
    extra: {},
  },
};
