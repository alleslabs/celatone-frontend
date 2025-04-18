import type { ChainConfig } from "@alleslabs/shared";

export const DEFAULT_CHAIN_CONFIG: ChainConfig = {
  chain: "",
  chainId: "",
  extra: {},
  features: {
    evm: {
      enabled: false,
    },
    gov: {
      enabled: false,
    },
    move: {
      enabled: false,
    },
    nft: {
      enabled: false,
    },
    pool: {
      enabled: false,
    },
    publicProject: {
      enabled: false,
    },
    wasm: {
      enabled: false,
    },
  },
  fees: {
    fee_tokens: [],
  },
  gas: {
    gasAdjustment: 1.0,
    maxGasLimit: 0,
  },
  network_type: "testnet",
  prettyName: "",
  registryChainName: "",
  rest: "",
  rpc: "",
  tier: "lite",
  wallets: [],
};
