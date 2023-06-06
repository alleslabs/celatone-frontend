import { SELECTED_CHAIN } from "env";
import type { Option } from "lib/types";

export type SupportedChain = "osmosis" | "terra" | "mitosis" | "sei";

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
  testnet: "osmosistestnet5",
};

// TODO: Remove this when mitosis is ready
export const MITOSIS_CHAINS: Chain = {
  mainnet: "osmosis",
  testnet: "osmosistestnet5",
};

export const SEI_CHAINS: Chain = {
  mainnet: "sei",
  testnet: "seitestnet2",
};

export const getSupportedChainNames = (): SupportedChain[] => {
  switch (SELECTED_CHAIN) {
    case "terra":
      return Object.values(TERRA_CHAINS);
    case "osmosis":
      return Object.values(OSMOSIS_CHAINS);
    case "mitosis":
      return Object.values(MITOSIS_CHAINS);
    case "sei":
      return Object.values(SEI_CHAINS);
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
      return TERRA_CHAINS[network] ?? TERRA_CHAINS.testnet;
    case "osmosis":
      return OSMOSIS_CHAINS[network] ?? OSMOSIS_CHAINS.testnet;
    case "mitosis":
      return MITOSIS_CHAINS[network] ?? MITOSIS_CHAINS.testnet;
    case "sei":
      return SEI_CHAINS[network] ?? SEI_CHAINS.testnet;
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
    case "mitosis":
      network = (Object.keys(MITOSIS_CHAINS) as Network[]).find(
        (each) => MITOSIS_CHAINS[each as keyof Chain] === chainName
      );
      break;
    case "sei":
      network = (Object.keys(SEI_CHAINS) as Network[]).find(
        (each) => SEI_CHAINS[each as keyof Chain] === chainName
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

interface ChainConfig {
  isWasm: boolean;
}

const CHAIN_CONFIG: Record<SupportedChain, ChainConfig> = {
  osmosis: {
    isWasm: true,
  },
  terra: {
    isWasm: true,
  },
  mitosis: {
    isWasm: false,
  },
  sei: {
    isWasm: true,
  },
};

export const getChainConfig = () => {
  if (!SELECTED_CHAIN)
    throw new Error(`${SELECTED_CHAIN} - environment variable not found`);
  if (!CHAIN_CONFIG[SELECTED_CHAIN])
    throw new Error(`Chain not found in chain config`);
  return CHAIN_CONFIG[SELECTED_CHAIN];
};
