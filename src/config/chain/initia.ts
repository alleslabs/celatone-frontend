import { wallets as initiaWallets } from "@cosmos-kit/initia";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

const INITIA_DECODER =
  "https://initia-api-jiod42ec2q-as.a.run.app/decode_module";

export const INITIA_CHAIN_CONFIGS: ChainConfigs = {
  "tomcat-1-lite": {
    tier: "lite",
    chain: "initia",
    registryChainName: "blackwingtestnet",
    prettyName: "Blackwing Testnet Lite",
    lcd: "https://maze-rest-18bdff44-3aa4-425e-9bc0-06a2afa40af8.ue1-prod.newmetric.xyz",
    rpc: "https://maze-rpc-18bdff44-3aa4-425e-9bc0-06a2afa40af8.ue1-prod.newmetric.xyz",
    indexer: "https://tomcat-1-graphql.alleslabs.dev/v1/graphql",
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
          "l2/ad2344d0c17127cc6bce67e360f43cd6c5fa09a7b5f6f9b7b80f9dc3e0c4876e",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
    },
  },
  "initiation-1": {
    tier: "lite",
    chain: "initia",
    registryChainName: "initiatestnet",
    prettyName: "Initia",
    lcd: "https://lcd.initiation-1.initia.xyz",
    rpc: "https://rpc.initiation-1.initia.xyz",
    indexer: "https://initiation-1-graphql.alleslabs.dev/v1/graphql",
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
        verify: "https://compiler.initiation-1.initia.xyz/contracts/verify",
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
  "minimove-1": {
    tier: "full",
    chain: "initia",
    registryChainName: "minimovetestnet",
    prettyName: "Minimove",
    lcd: "https://lcd.minimove-1.initia.xyz",
    rpc: "https://rpc.minimove-1.initia.xyz",
    indexer: "https://minimove-1-graphql.alleslabs.dev/v1/graphql",
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
          "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
    },
  },
  "miniwasm-1": {
    tier: "full",
    chain: "initia",
    registryChainName: "miniwasmtestnet",
    prettyName: "Miniwasm",
    lcd: "https://lcd.miniwasm-1.initia.xyz",
    rpc: "https://rpc.miniwasm-1.initia.xyz:443",
    indexer: "https://miniwasm-1-graphql.alleslabs.dev/v1/graphql",
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
          "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
    },
  },
  "tomcat-1": {
    tier: "full",
    chain: "initia",
    registryChainName: "blackwingtestnet",
    prettyName: "Blackwing",
    lcd: "https://maze-rest-18bdff44-3aa4-425e-9bc0-06a2afa40af8.ue1-prod.newmetric.xyz",
    rpc: "https://maze-rpc-18bdff44-3aa4-425e-9bc0-06a2afa40af8.ue1-prod.newmetric.xyz",
    indexer: "https://tomcat-1-graphql.alleslabs.dev/v1/graphql",
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
          "l2/aee375e9d0b181f0d9d3a49f9a3d1d6b05d62b0ac81f8c92b9282afa4213d884",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
    },
  },
  "init-ai-1": {
    tier: "full",
    chain: "initia",
    registryChainName: "initaitestnet",
    prettyName: "INIT AI",
    lcd: "https://maze-rest-617bacff-7d34-4eb8-87f4-ee16fb4e0ac7.ue1-prod.newmetric.xyz",
    rpc: "https://maze-rpc-617bacff-7d34-4eb8-87f4-ee16fb4e0ac7.ue1-prod.newmetric.xyz",
    indexer: "https://init-ai-1-graphql.alleslabs.dev/v1/graphql",
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
          "l2/aadf1a9da6a38b7e7e11839364ee42002260eff1657f403b9ce608337bcb986b",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
    },
  },
  "burrito-1": {
    tier: "full",
    chain: "initia",
    registryChainName: "noontestnet",
    prettyName: "Noon",
    lcd: "https://burrito-1-lcd.lunchlunch.xyz",
    rpc: "https://burrito-1-rpc.lunchlunch.xyz",
    indexer: "https://burrito-1-graphql.alleslabs.dev/v1/graphql",
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
          "l2/ffea49d63cbadcfd749b4f635eca198b2f3b44cb1f6b580f5d201d58f3bf7aea",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
    },
  },
  "birdee-1": {
    tier: "full",
    chain: "initia",
    registryChainName: "tucanatestnet",
    prettyName: "Tucana",
    lcd: "https://maze-rest-c9796789-107d-49ab-b6de-059724d2a91d.ue1-prod.newmetric.xyz",
    rpc: "https://maze-rpc-c9796789-107d-49ab-b6de-059724d2a91d.ue1-prod.newmetric.xyz",
    indexer: "https://birdee-1-graphql.alleslabs.dev/v1/graphql",
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
        denom: "utuc",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
    },
  },
};
