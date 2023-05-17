import type { ContractAddr, HumanAddr, ValidatorAddr } from "lib/types";

import type { ChainConfig, ChainConfigs, ProjectConstants } from "./types";

export const DEFAULT_CHAIN_CONFIG: ChainConfig = {
  chain: "",
  registryChainName: "",
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
  },
  gas: {
    gasPrice: {
      tokenPerGas: 0,
      denom: "",
    },
    gasAdjustment: 1.0,
  },
  exampleAddresses: {
    user: "" as HumanAddr,
    contract: "" as ContractAddr,
    validator: "" as ValidatorAddr,
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
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
    },
    exampleAddresses: {
      user: "osmo14wk9zecqam9jsac7xwtf8e349ckquzzlx9k8c3" as HumanAddr,
      contract:
        "osmo1p0pxllmqjgl2tefy7grypt34jdpdltg3ka98n8unnl322wqps7lqtu576h" as ContractAddr,
      validator:
        "osmovaloper1hh0g5xf23e5zekg45cmerc97hs4n2004dy2t26" as ValidatorAddr,
    },
    explorerLink: {
      validator: "https://www.mintscan.io/osmosis/validators",
      proposal: "https://www.mintscan.io/osmosis/proposals",
    },
  },
  "osmo-test-4": {
    chain: "osmosis",
    registryChainName: "osmosistestnet",
    lcd: "https://lcd-test.osmosis.zone",
    rpc: "https://rpc-test.osmosis.zone",
    indexer: "https://osmosis-testnet-graphql.alleslabs.dev/v1/graphql",
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
      },
    },
    gas: {
      gasPrice: {
        tokenPerGas: 0.025,
        denom: "uosmo",
      },
      gasAdjustment: 1.5,
    },
    exampleAddresses: {
      user: "osmo14wk9zecqam9jsac7xwtf8e349ckquzzlx9k8c3" as HumanAddr,
      contract:
        "osmo1p0pxllmqjgl2tefy7grypt34jdpdltg3ka98n8unnl322wqps7lqtu576h" as ContractAddr,
      validator:
        "osmovaloper1hh0g5xf23e5zekg45cmerc97hs4n2004dy2t26" as ValidatorAddr,
    },
    explorerLink: {
      validator: "https://www.mintscan.io/osmosis/validators",
      proposal: "https://www.mintscan.io/osmosis/proposals",
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
