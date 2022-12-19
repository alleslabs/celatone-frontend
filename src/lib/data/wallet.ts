export const MAINNET_CHAIN_NAMES = ["osmosis"];

export const TESTNET_CHAIN_NAMES = ["osmosistestnet"];

export const CHAIN_NAMES = [...MAINNET_CHAIN_NAMES, ...TESTNET_CHAIN_NAMES];

export const DEFAULT_CHAIN = TESTNET_CHAIN_NAMES[0];

export const PROPER_CHAINID_MAP: { [key: string]: { [key: string]: string } } =
  {
    osmosis: { name: "Osmosis Mainnet", chainID: "osmosis-1" },
    osmosistestnet: { name: "Osmosis Testnet", chainID: "osmo-test-4" },
  };
