import { SUPPORTED_CHAIN } from "env";

export const TERRA_CHAIN_NAMES = ["terra2", "terra2testnet"];

export const OSMOSIS_CHAIN_NAMES = ["osmosis", "osmosistestnet"];

export const ALL_CHAIN_NAMES = [...TERRA_CHAIN_NAMES, ...OSMOSIS_CHAIN_NAMES];

export const getSupportedChainNames = () => {
  switch (SUPPORTED_CHAIN) {
    case "terra":
      return TERRA_CHAIN_NAMES;
    case "osmosis":
      return OSMOSIS_CHAIN_NAMES;
    default:
      throw new Error(`Unsupported chain: ${SUPPORTED_CHAIN}`);
  }
};

export const getDefaultChainName = () => {
  const supportedChainNames = getSupportedChainNames();
  return supportedChainNames[0];
};
