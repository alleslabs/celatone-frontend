import { FALLBACK_SUPPORTED_CHAIN_ID } from "env";

import { DEFAULT_CHAIN_CONFIG } from "./default";
import { INITIA_CHAIN_CONFIGS } from "./initia";
import { NEUTRON_CHAIN_CONFIGS } from "./neutron";
import { OSMOSIS_CHAIN_CONFIGS } from "./osmosis";
import { SEI_CHAIN_CONFIGS } from "./sei";
import { STARGAZE_CHAIN_CONFIGS } from "./stargaze";
import { TERRA_CHAIN_CONFIGS } from "./terra";
import type { ChainConfigs } from "./types";

export * from "./types";
export * from "./default";

export const CHAIN_CONFIGS: ChainConfigs = {
  ...OSMOSIS_CHAIN_CONFIGS,
  ...SEI_CHAIN_CONFIGS,
  ...NEUTRON_CHAIN_CONFIGS,
  ...STARGAZE_CHAIN_CONFIGS,
  ...TERRA_CHAIN_CONFIGS,
  ...INITIA_CHAIN_CONFIGS,
};

export const FALLBACK_CHAIN_CONFIG =
  CHAIN_CONFIGS[FALLBACK_SUPPORTED_CHAIN_ID] ?? DEFAULT_CHAIN_CONFIG;
