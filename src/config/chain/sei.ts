import { wallets as compassWallets } from "@cosmos-kit/compass";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";

import type { ChainConfigs } from "./types";

/**
 * @remarks
 * Because Sei utilizes Cosmos SDK v0.26, which lacks the anyOfAddresses feature, we need to disable it.
 * We already have disabled only normal upload section, not proposal to store code section.
 */
export const SEI_CHAIN_CONFIGS: ChainConfigs = {
  "pacific-1": {
    chain: "sei",
    registryChainName: "sei",
    prettyName: "Sei",
    lcd: "https://sei-api.polkachu.com",
    rpc: "https://sei-rpc.polkachu.com",
    indexer: "https://pacific-1-graphql.alleslabs.dev/v1/graphql",
    api: "https://celatone-api.alleslabs.dev",
    wallets: [...compassWallets, ...keplrWallets],
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
    extra: {
      disableAnyOfAddresses: true,
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
    wallets: [...compassWallets, ...keplrWallets],
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
    extra: {
      disableAnyOfAddresses: true,
    },
  },
};
