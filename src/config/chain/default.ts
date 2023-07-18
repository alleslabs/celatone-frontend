import type { ChainConfig } from "./types";

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
