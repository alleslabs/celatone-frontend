export const MAINNET_CHAIN_NAMES = ["osmosis"];

export const TESTNET_CHAIN_NAMES = ["osmosistestnet"];

export const CHAIN_NAMES = [...MAINNET_CHAIN_NAMES, ...TESTNET_CHAIN_NAMES];

export const DEFAULT_CHAIN = TESTNET_CHAIN_NAMES[0];

export const OSMOSIS_TESTNET_GQL_ENDPOINT =
  "https://osmosis-testnet-graphql.alleslabs.dev/v1/graphql";
