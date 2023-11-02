import {
  DEFAULT_THEME,
  INITIA_THEME,
  OSMOSIS_THEME,
  SEI_THEME,
} from "config/theme";

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

export const DUMMY_MNEMONIC = (() => {
  const mnemonic = process.env.NEXT_PUBLIC_DUMMY_MNEMONIC;
  if (!mnemonic)
    throw new Error(
      "NEXT_PUBLIC_DUMMY_MNEMONIC is empty. Please include a valid mnemonic."
    );

  return mnemonic;
})();

export const CELATONE_API_OVERRIDE =
  process.env.NEXT_PUBLIC_CELATONE_API_OVERRIDE;

// CURRENT THEME CONFIG
export const CURR_THEME = (() => {
  switch (process.env.NEXT_PUBLIC_THEME) {
    case "osmosis":
      return OSMOSIS_THEME;
    case "sei":
      return SEI_THEME;
    case "initia":
      return INITIA_THEME;
    default:
      return DEFAULT_THEME;
  }
})();

export const HASURA_ADMIN_SECRET =
  process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ?? "";
