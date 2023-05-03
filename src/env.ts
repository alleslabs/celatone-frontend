import type { SupportedChain } from "lib/data";

export const SUPPORTED_CHAIN_IDS: string[] =
  process.env.NEXT_PUBLIC_SUPPORTED_CHAIN_IDS?.split(",") ?? [""];

export const FALLBACK_LCD_ENDPOINT: Record<string, string> = {
  osmosis: "https://lcd.osmosis.zone/",
  osmosistestnet: "https://lcd-test.osmosis.zone/",
  terra2: "https://phoenix-lcd.terra.dev/",
  terra2testnet: "https://pisco-lcd.terra.dev/",
};

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
