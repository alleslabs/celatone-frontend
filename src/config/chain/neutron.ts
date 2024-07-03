import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

export const NEUTRON_CHAIN_CONFIGS: ChainConfigs = {
  "neutron-1": {
    tier: "full",
    chain: "neutron",
    registryChainName: "neutron",
    prettyName: "Neutron",
    networkType: "mainnet",
    layer: null,
    logoUrl: "https://assets.alleslabs.dev/integrations/chains/neutron.png",
    lcd: "https://rest-kralum.neutron-1.neutron.org",
    rpc: "https://rpc-kralum.neutron-1.neutron.org:443",
    indexer: "https://neutron-1-graphql.alleslabs.dev/v1/graphql",
    wallets: [...keplrWallets],
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
        tokenPerGas: 0.56,
        denom: "untrn",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: "https://www.mintscan.io/cosmos/validators",
    },
  },
  "pion-1": {
    tier: "full",
    chain: "neutron",
    registryChainName: "neutrontestnet",
    prettyName: "Neutron Testnet",
    networkType: "testnet",
    layer: null,
    logoUrl: "https://assets.alleslabs.dev/integrations/chains/neutron.png",
    lcd: "https://rest-palvus.pion-1.ntrn.tech:443",
    rpc: "https://rpc-palvus.pion-1.ntrn.tech:443",
    indexer: "https://pion-1-graphql.alleslabs.dev/v1/graphql",
    wallets: [...keplrWallets],
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
        enabled: false,
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
        tokenPerGas: 0.025,
        denom: "untrn",
      },
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink:
        "https://www.mintscan.io/ics-testnet-provider/validators",
    },
  },
};
