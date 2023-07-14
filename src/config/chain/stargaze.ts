import type { ChainConfigs } from "./types";

export const STARGAZE_CHAIN_CONFIGS: ChainConfigs = {
  "stargaze-1": {
    chain: "stargaze",
    registryChainName: "stargaze",
    prettyName: "Stargaze",
    lcd: "https://rest.stargaze-apis.com",
    rpc: "https://rpc.stargaze-apis.com",
    indexer: "https://stargaze-mainnet-graphql.alleslabs.dev/v1/graphql",
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
        tokenPerGas: 1.1,
        denom: "ustars",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://www.mintscan.io/stargaze/validators",
      proposal: "https://www.mintscan.io/stargaze/proposals",
    },
    hasSubHeader: false,
  },
};
