import type { ChainConfig } from "@alleslabs/shared";

import { SUPPORTED_NETWORK_TYPES } from "env";

export const DEFAULT_WASM_CONFIG: ChainConfig["features"]["wasm"] = {
  clearAdminGas: 1000000,
  enabled: true,
  storeCodeMaxFileSize: 1024 * 1024 * 2,
};

export const DEFAULT_MOVE_CONFIG: ChainConfig["features"]["move"] = {
  enabled: true,
  moduleMaxFileSize: 1024 * 1024,
};

export const DEFAULT_POOL_CONFIG: ChainConfig["features"]["pool"] = {
  enabled: false,
};

export const DEFAULT_PUBLIC_PROJECT_CONFIG: ChainConfig["features"]["publicProject"] =
  {
    enabled: false,
  };

export const DEFAULT_GOV_CONFIG: ChainConfig["features"]["gov"] = {
  enabled: false,
};

export const DEFAULT_BECH32_PREFIX = "init";

export const DEFAULT_GAS = {
  average_gas_price: 0.15,
  fixed_min_gas_price: 0.15,
  gasAdjustment: 1.5,
  gasPrice: 0.15,
  high_gas_price: 0.15,
  low_gas_price: 0.15,
  maxGasLimit: 25000000,
};

export const DEFAULT_SLIP44 =
  SUPPORTED_NETWORK_TYPES[0] === "mainnet" ? 60 : 118;

export const DEFAULT_DENOM = "umin";

export const DEFAULT_CUSTOM_MINITIA_NETWORK: Pick<
  ChainConfig,
  "tier" | "chain" | "wallets" | "network_type" | "extra"
> = {
  chain: "initia",
  extra: {
    isValidatorExternalLink: null,
    layer: "2",
  },
  network_type: "local",
  tier: "sequencer",
  wallets: [],
};
