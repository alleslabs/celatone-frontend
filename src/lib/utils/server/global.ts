import { CHAIN_CONFIGS, DEFAULT_CHAIN_CONFIG } from "config";
import type { ChainConfig } from "config/types";

export const getChainConfig = (chainId: string): ChainConfig => {
  return CHAIN_CONFIGS[chainId] ?? DEFAULT_CHAIN_CONFIG;
};
