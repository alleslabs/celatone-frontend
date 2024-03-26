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
        verify: "https://compiler.mahalo-2.initia.xyz/contracts/verify",
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
      validator: "https://app.testnet.initia.xyz/validator",
      proposal: "https://app.testnet.initia.xyz/proposal",
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
          "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator:
        "https://lcd.minimove-2.initia.xyz/opinit/opchild/v1/validator",
      proposal: "",
    },
    extra: { disableDelegation: true },
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
          "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator:
        "https://lcd.miniwasm-2.initia.xyz/opinit/opchild/v1/validator",
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
    indexer: "https://stone-12-1-nft-graphql.alleslabs.dev/v1/graphql",
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
      validator: "https://app.stone-13.initia.xyz/validator",
      proposal: "https://app.stone-13.initia.xyz/proposal",
    },
    extra: {},
  },
};
