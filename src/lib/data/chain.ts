import { SUPPORTED_CHAIN } from "env";
import type { Option } from "lib/types";

interface Chain {
  mainnet: string;
  testnet: string;
  localnet?: string;
}

export const TERRA_CHAINS: Chain = {
  mainnet: "terra2",
  testnet: "terra2testnet",
};

export const OSMOSIS_CHAINS: Chain = {
  mainnet: "osmosis",
  testnet: "osmosistestnet",
};

export const getSupportedChainNames = (): string[] => {
  switch (SUPPORTED_CHAIN) {
    case "terra":
      return Object.values(TERRA_CHAINS);
    case "osmosis":
      return Object.values(OSMOSIS_CHAINS);
    default:
      throw new Error(`Unsupported chain: ${SUPPORTED_CHAIN}`);
  }
};

/**
 *
 * @param network network name from router.query.network
 * @returns chain name
 * @throws Error if network doesn't match any of the supported networks
 */
export const getChainNameByNetwork = (network: string): string => {
  if (network !== "mainnet" && network !== "testnet" && network !== "localnet")
    throw new Error(
      `Network doesn't match any of the supported networks, Currently: ${network}`
    );

  let chainName: Option<string>;

  switch (SUPPORTED_CHAIN) {
    case "terra":
      chainName = TERRA_CHAINS[network];
      break;
    case "osmosis":
      chainName = OSMOSIS_CHAINS[network];
      break;
    default:
      throw new Error(`Unsupported chain: ${SUPPORTED_CHAIN}`);
  }

  if (!chainName)
    throw new Error(
      `Can't find chain name for network: ${network} and chain: ${SUPPORTED_CHAIN}`
    );

  return chainName;
};

export const getNetworkByChainName = (chainName: string): string => {
  let network: Option<string>;

  switch (SUPPORTED_CHAIN) {
    case "terra":
      network = Object.keys(TERRA_CHAINS).find(
        (each) => TERRA_CHAINS[each as keyof Chain] === chainName
      );
      break;
    case "osmosis":
      network = Object.keys(OSMOSIS_CHAINS).find(
        (each) => OSMOSIS_CHAINS[each as keyof Chain] === chainName
      );
      break;
    default:
      throw new Error(`Unsupported chain: ${SUPPORTED_CHAIN}`);
  }

  if (!network)
    throw new Error(
      `Can't find network for chain name: ${chainName} and chain: ${SUPPORTED_CHAIN}`
    );

  return network;
};
