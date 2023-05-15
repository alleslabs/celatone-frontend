import type { SupportedChain } from "lib/data";

export const SUPPORTED_CHAIN_IDS: string[] = (() => {
  const chainIds = process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS?.split(",");
  if (!chainIds)
    throw new Error("NEXT_PUBLIC_SUPPORTED_CHAIN_IDS is undefined");

  if (chainIds[0].trim().length === 0)
    throw new Error(
      "NEXT_PUBLIC_SUPPORTED_CHAIN_IDS is not valid. Please include at least one chain identifier. For instance, NEXT_PUBLIC_SUPPORTED_CHAIN_IDS=osmo-test-5"
    );

  return chainIds;
})();

// Remark: We've already checked that the first element is not empty on the above code
export const DEFAULT_SUPPORTED_CHAIN_ID = SUPPORTED_CHAIN_IDS[0];

export const DUMMY_MNEMONIC = process.env.NEXT_PUBLIC_DUMMY_MNEMONIC;

export const SELECTED_CHAIN = process.env
  .NEXT_PUBLIC_SELECTED_CHAIN as SupportedChain;

export const CELATONE_API_ENDPOINT = "https://celatone-api.alleslabs.dev";

export const getChainApiPath = (chainName: string) => {
  switch (chainName) {
    case "osmosistestnet":
    case "osmosis":
      return "osmosis";
    case "terra2":
    case "terra2testnet":
      return "terra";
    default:
      return undefined;
  }
};
// TODO to handle testnet separately later
export const getMainnetApiPath = (chainId: string) => {
  switch (chainId) {
    case "osmo-test-4":
    case "osmosis-1":
      return "osmosis-1";
    case "pisco-1":
    case "phoenix-1":
      return "phoenix-1";
    default:
      return undefined;
  }
};
