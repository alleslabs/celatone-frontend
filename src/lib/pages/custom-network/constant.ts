import type { ChainConfig } from "@alleslabs/shared";

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
    enabled: true,
  };

export const DEFAULT_GOV_CONFIG: ChainConfig["features"]["gov"] = {
  enabled: false,
};

export const DEFAULT_WALLET_CONFIG: ChainConfig["wallets"] = [
  "initia",
  "keplr",
];

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

export const DEFAULT_SLIP44 = 118;

export const DEFAULT_DENOM = "umin";

export const DEFAULT_CUSTOM_MINITIA_NETWORK: Pick<
  ChainConfig,
  "chain" | "extra" | "network_type" | "tier"
> = {
  chain: "initia",
  extra: {
    isValidatorExternalLink: null,
    layer: "2",
  },
  network_type: "local",
  tier: "sequencer",
};
