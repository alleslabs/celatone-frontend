import type { ChainConfig } from "@alleslabs/shared";

export const DEFAULT_CHAIN_CONFIG: ChainConfig = {
  tier: "lite",
  chainId: "",
  chain: "",
  registryChainName: "",
  prettyName: "",
  lcd: "",
  rpc: "",
  wallets: [],
  features: {
    wasm: {
      enabled: false,
    },
    move: {
      enabled: false,
    },
    evm: {
      enabled: false,
    },
    pool: {
      enabled: false,
    },
    gov: {
      enabled: false,
    },
    nft: {
      enabled: false,
    },
    publicProject: {
      enabled: false,
    },
  },
  gas: {
    gasAdjustment: 1.0,
    maxGasLimit: 0,
  },
  extra: {},
  network_type: "testnet",
  fees: {
    fee_tokens: [],
  },
};
