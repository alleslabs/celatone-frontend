import type { ContractAddr, HumanAddr, ValidatorAddr } from "lib/types";

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
  exampleAddresses: {
    user: "" as HumanAddr,
    contract: "" as ContractAddr,
    validator: "" as ValidatorAddr,
  },
  explorerLink: {
    validator: "",
    proposal: "",
  },
  hasSubHeader: false,
};

const DEFAULT_CELATONE_API_ENDPOINT = "https://celatone-api.alleslabs.dev";

export const CHAIN_CONFIGS: ChainConfigs = {
  "osmosis-1": {
    chain: "osmosis",
    registryChainName: "osmosis",
    prettyName: "Osmosis",
    lcd: "https://lcd.osmosis.zone",
    rpc: "https://rpc.osmosis.zone",
    indexer: "https://osmosis-mainnet-graphql.alleslabs.dev/v1/graphql",
    api: DEFAULT_CELATONE_API_ENDPOINT,
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
    hasSubHeader: false,
  },
  "osmo-test-5": {
    chain: "osmosis",
    registryChainName: "osmosistestnet5",
    prettyName: "Osmosis Testnet",
    lcd: "https://lcd.osmotest5.osmosis.zone",
    rpc: "https://rpc.osmotest5.osmosis.zone",
    indexer: "https://osmo-test-5-graphql.alleslabs.dev/v1/graphql",
    api: DEFAULT_CELATONE_API_ENDPOINT,
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
    exampleAddresses: {
      user: "osmo14wk9zecqam9jsac7xwtf8e349ckquzzlx9k8c3" as HumanAddr,
      contract:
        "osmo1p0pxllmqjgl2tefy7grypt34jdpdltg3ka98n8unnl322wqps7lqtu576h" as ContractAddr,
      validator:
        "osmovaloper1hh0g5xf23e5zekg45cmerc97hs4n2004dy2t26" as ValidatorAddr,
    },
    explorerLink: {
      validator: "https://testnet.mintscan.io/osmosis-testnet/validators",
      proposal: "https://testnet.mintscan.io/osmosis-testnet/proposals",
    },
    hasSubHeader: false,
  },
  "pacific-1": {
    chain: "sei",
    registryChainName: "sei",
    prettyName: "Sei",
    lcd: "https://sei-api.polkachu.com",
    rpc: "https://sei-rpc.polkachu.com",
    indexer: "https://pacific-1-graphql.alleslabs.dev/v1/graphql",
    api: DEFAULT_CELATONE_API_ENDPOINT,
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
    exampleAddresses: {
      user: "sei1acqpnvg2t4wmqfdv8hq47d3petfksjs5xjfnyj" as HumanAddr,
      contract:
        "sei18l6zzyyhrl7j9zw2lew50677va25rtsa2s4yy5gdpg4nxz3y3j9se47f0k" as ContractAddr,
      validator:
        "seivaloper1hh0g5xf23e5zekg45cmerc97hs4n2004dy2t26" as ValidatorAddr,
    },
    explorerLink: {
      validator: "",
      proposal: "",
    },
    hasSubHeader: true,
  },
  "atlantic-2": {
    chain: "sei",
    registryChainName: "seitestnet2",
    prettyName: "Sei Testnet2",
    lcd: "https://rest.atlantic-2.seinetwork.io",
    rpc: "https://rpc.atlantic-2.seinetwork.io",
    indexer: "https://atlantic-2-graphql.alleslabs.dev/v1/graphql",
    api: DEFAULT_CELATONE_API_ENDPOINT,
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
    exampleAddresses: {
      user: "sei1acqpnvg2t4wmqfdv8hq47d3petfksjs5xjfnyj" as HumanAddr,
      contract:
        "sei18l6zzyyhrl7j9zw2lew50677va25rtsa2s4yy5gdpg4nxz3y3j9se47f0k" as ContractAddr,
      validator:
        "seivaloper1hh0g5xf23e5zekg45cmerc97hs4n2004dy2t26" as ValidatorAddr,
    },
    explorerLink: {
      validator: "https://testnet.mintscan.io/sei-testnet/validators",
      proposal: "https://testnet.mintscan.io/sei-testnet/proposals",
    },
    hasSubHeader: true,
  },
  "neutron-1": {
    chain: "neutron",
    registryChainName: "neutron",
    prettyName: "Neutron",
    lcd: "https://rest-kralum.neutron-1.neutron.org",
    rpc: "https://rpc-kralum.neutron-1.neutron.org",
    indexer: "https://neutron-1-graphql.alleslabs.dev/v1/graphql",
    api: DEFAULT_CELATONE_API_ENDPOINT,
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
        denom: "untrn",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    exampleAddresses: {
      user: "neutron19glux3jzdfyyz6ylmuksgxfj5phdaxfr2uhy86" as HumanAddr,
      contract:
        "neutron1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrstdxvff" as ContractAddr,
      validator:
        "neutronvaloper1c4k24jzduc365kywrsvf5ujz4ya6mwym69umfr" as ValidatorAddr,
    },
    explorerLink: {
      validator: "https://www.mintscan.io/neutron/validators",
      proposal: "",
    },
    hasSubHeader: false,
  },
  "pion-1": {
    chain: "neutron",
    registryChainName: "neutrontestnet",
    prettyName: "Neutron Testnet",
    lcd: "https://rest-palvus.pion-1.ntrn.tech:443",
    rpc: "https://rpc-palvus.pion-1.ntrn.tech:443",
    indexer: "https://pion-1-graphql.alleslabs.dev/v1/graphql",
    api: DEFAULT_CELATONE_API_ENDPOINT,
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
        denom: "untrn",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    exampleAddresses: {
      user: "neutron19glux3jzdfyyz6ylmuksgxfj5phdaxfr2uhy86" as HumanAddr,
      contract:
        "neutron1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrstdxvff" as ContractAddr,
      validator:
        "neutronvaloper1c4k24jzduc365kywrsvf5ujz4ya6mwym69umfr" as ValidatorAddr,
    },
    explorerLink: {
      validator: "https://www.mintscan.io/neutron/validators",
      proposal: "",
    },
    hasSubHeader: false,
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
    exampleAddresses: {
      user: "osmo14wk9zecqam9jsac7xwtf8e349ckquzzlx9k8c3" as HumanAddr,
      contract:
        "osmo1p0pxllmqjgl2tefy7grypt34jdpdltg3ka98n8unnl322wqps7lqtu576h" as ContractAddr,
      validator:
        "osmovaloper1hh0g5xf23e5zekg45cmerc97hs4n2004dy2t26" as ValidatorAddr,
    },
    explorerLink: {
      validator: "",
      proposal: "",
    },
    hasSubHeader: false,
  },
};

export const PROJECT_CONSTANTS: ProjectConstants = {
  maxListNameLength: 50,
  maxContractNameLength: 50,
  maxContractDescriptionLength: 250,
  maxCodeNameLength: 50,
  maxProposalTitleLength: 255,
};
