import type { ContractAddr, HumanAddr, ValidatorAddr } from "lib/types";

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
    exampleAddresses: {
      user: "stars16hetkn089m2s8nsjwppwhjed4ecp4dqtvltv82" as HumanAddr,
      contract:
        "stars1m4ns69zvkk2zv0946mw298tlky5ckvu08rtxggtg29p784kc5sxqwgx4h0" as ContractAddr,
      validator:
        "starsvaloper1mz2qks48v486d9m8wp4l9fxm2e9l0e0kzk79m5" as ValidatorAddr,
    },
    explorerLink: {
      validator: "https://www.mintscan.io/stargaze/validators",
      proposal: "https://www.mintscan.io/stargaze/proposals",
    },
    hasSubHeader: false,
  },
};
