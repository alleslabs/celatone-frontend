export const MAINNET_CHAIN_NAMES = ["osmosis"];

export const TESTNET_CHAIN_NAMES = ["osmosistestnet"];

export const CHAIN_NAMES = [...MAINNET_CHAIN_NAMES, ...TESTNET_CHAIN_NAMES];

export const DEFAULT_CHAIN = TESTNET_CHAIN_NAMES[0];

export const PROPER_CHAINID_MAP: { [key: string]: string } = {
  osmosis: "osmosis-1",
  osmosistestnet: "osmo-test-4",
};
