import { SELECTED_CHAIN } from "env";
import type { Option } from "lib/types";

interface Chain {
  mainnet: string;
  testnet: string;
  localnet?: string;
}

export type Network = keyof Chain;

export const TERRA_CHAINS: Chain = {
  mainnet: "terra2",
  testnet: "terra2testnet",
};

export const OSMOSIS_CHAINS: Chain = {
  mainnet: "osmosis",
  testnet: "osmosistestnet",
};

export const getSupportedChainNames = (): string[] => {
  switch (SELECTED_CHAIN) {
    case "terra":
      return Object.values(TERRA_CHAINS);
    case "osmosis":
      return Object.values(OSMOSIS_CHAINS);
    default:
      throw new Error(`Unsupported chain: ${SELECTED_CHAIN}`);
  }
};

/**
 *
 * @param network network name from router.query.network
 * @returns chain name
 * @throws Error if network doesn't match any of the supported networks
 */
export const getChainNameByNetwork = (network: Network): string => {
  switch (SELECTED_CHAIN) {
    case "terra":
      return TERRA_CHAINS[network] ?? TERRA_CHAINS.mainnet;
    case "osmosis":
      return OSMOSIS_CHAINS[network] ?? OSMOSIS_CHAINS.mainnet;
    default:
      throw new Error(`Unsupported chain: ${SELECTED_CHAIN}`);
  }
};

export const getNetworkByChainName = (chainName: string): Network => {
  let network: Option<Network>;

  switch (SELECTED_CHAIN) {
    case "terra":
      network = (Object.keys(TERRA_CHAINS) as Network[]).find(
        (each) => TERRA_CHAINS[each as keyof Chain] === chainName
      );
      break;
    case "osmosis":
      network = (Object.keys(OSMOSIS_CHAINS) as Network[]).find(
        (each) => OSMOSIS_CHAINS[each as keyof Chain] === chainName
      );
      break;
    default:
      throw new Error(`Unsupported chain: ${SELECTED_CHAIN}`);
  }

  if (!network)
    throw new Error(
      `Can't find network for chain name: ${chainName} and chain: ${SELECTED_CHAIN}`
    );

  return network;
};
