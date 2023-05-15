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

// TODO: Below are deprecated. Remove them later
export const FALLBACK_LCD_ENDPOINT: Record<string, string> = {
  osmosis: "https://lcd.osmosis.zone/",
  osmosistestnet: "https://lcd-test.osmosis.zone/",
  terra2: "https://phoenix-lcd.terra.dev/",
  terra2testnet: "https://pisco-lcd.terra.dev/",
};

export const SELECTED_CHAIN = process.env
  .NEXT_PUBLIC_SELECTED_CHAIN as SupportedChain;
