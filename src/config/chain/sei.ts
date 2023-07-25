import type { ChainConfigs } from "./types";

export const SEI_CHAIN_CONFIGS: ChainConfigs = {
  "pacific-1": {
    chain: "sei",
    registryChainName: "sei",
    prettyName: "Sei",
    lcd: "https://sei-api.polkachu.com",
    rpc: "https://sei-rpc.polkachu.com",
    indexer: "https://pacific-1-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
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
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "usei",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "",
      proposal: "",
    },
  },
  "atlantic-2": {
    chain: "sei",
    registryChainName: "seitestnet2",
    prettyName: "Sei Testnet2",
    lcd: "https://rest.atlantic-2.seinetwork.io",
    rpc: "https://rpc.atlantic-2.seinetwork.io",
    indexer: "https://atlantic-2-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
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
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "usei",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://testnet.mintscan.io/sei-testnet/validators",
      proposal: "https://testnet.mintscan.io/sei-testnet/proposals",
    },
  },
};
