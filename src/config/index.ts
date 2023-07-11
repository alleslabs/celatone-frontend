import type { ChainConfig, ChainConfigs, ProjectConstants } from "./types";

export const DEFAULT_CHAIN_CONFIG: ChainConfig = {
  chain: "",
  registryChainName: "",
  prettyName: "",
  lcd: "",
  rpc: "",
  indexer: "",
  api: "",
  features: {
    faucet: {
      enabled: false,
    },
    wasm: {
      enabled: false,
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
      tokenPerGas: 0,
      denom: "",
    },
    gasAdjustment: 1.0,
    maxGasLimit: 0,
  },
  explorerLink: {
    validator: "",
    proposal: "",
  },
};

export const CHAIN_CONFIGS: ChainConfigs = {
  "osmosis-1": {
    chain: "osmosis",
    registryChainName: "osmosis",
    prettyName: "Osmosis",
    lcd: "https://lcd.osmosis.zone",
    rpc: "https://rpc.osmosis.zone",
    indexer: "https://osmosis-mainnet-graphql.alleslabs.dev/v1/graphql",
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
        enabled: true,
        url: "https://app.osmosis.zone/pool",
      },
      publicProject: {
        enabled: true,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://www.mintscan.io/osmosis/validators",
      proposal: "https://www.mintscan.io/osmosis/proposals",
    },
  },
  "osmo-test-5": {
    chain: "osmosis",
    registryChainName: "osmosistestnet5",
    prettyName: "Osmosis Testnet",
    lcd: "https://lcd.osmotest5.osmosis.zone",
    rpc: "https://rpc.osmotest5.osmosis.zone",
    indexer: "https://osmo-test-5-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
    features: {
      faucet: {
        enabled: true,
        url: "https://faucet.alleslabs.dev",
      },
      wasm: {
        enabled: true,
        storeCodeMaxFileSize: 800_000,
        clearAdminGas: 50_000,
      },
      pool: {
        enabled: true,
        url: "https://testnet.osmosis.zone/pool",
      },
      publicProject: {
        enabled: false,
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "https://testnet.mintscan.io/osmosis-testnet/validators",
      proposal: "https://testnet.mintscan.io/osmosis-testnet/proposals",
    },
  },
  localosmosis: {
    chain: "osmosis",
    registryChainName: "localosmosis",
    prettyName: "Local Osmosis",
    lcd: "http://localhost/rest",
    rpc: "http://localhost/rpc/",
    indexer: "http://localhost/hasura/v1/graphql",
    api: "http://localhost/api",
    features: {
      faucet: {
        enabled: true,
        url: "http://localhost:5005/request",
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
        tokenPerGas: 0.25,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    explorerLink: {
      validator: "",
      proposal: "",
    },
  },
};

export const PROJECT_CONSTANTS: ProjectConstants = {
  maxListNameLength: 50,
  maxContractNameLength: 50,
  maxContractDescriptionLength: 250,
  maxCodeNameLength: 50,
  maxProposalTitleLength: 255,
};
