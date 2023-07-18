import type { ContractAddr, HumanAddr, ValidatorAddr } from "lib/types";

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
};
