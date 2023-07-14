import type { ContractAddr, HumanAddr, ValidatorAddr } from "lib/types";

import type { ChainConfigs } from "./types";

export const NEUTRON_CHAIN_CONFIGS: ChainConfigs = {
  "neutron-1": {
    chain: "neutron",
    registryChainName: "neutron",
    prettyName: "Neutron",
    lcd: "https://rest-kralum.neutron-1.neutron.org",
    rpc: "https://rpc-kralum.neutron-1.neutron.org",
    indexer: "https://neutron-1-graphql.alleslabs.dev/v1/graphql",
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
};
