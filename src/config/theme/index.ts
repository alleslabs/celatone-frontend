import { CHAIN } from "env";

import { DEFAULT_THEME } from "./default";
import { INITIA_THEME } from "./initia";
// import { OSMOSIS_THEME } from "./osmosis";
import { SEI_THEME } from "./sei";

export const getTheme = (chain: string) => {
  switch (chain) {
    // case "osmosis":
    //   return OSMOSIS_THEME;
    case "sei":
      return SEI_THEME;
    case "initia":
      return INITIA_THEME;
    default:
      return DEFAULT_THEME;
  }
};

export const FALLBACK_THEME = getTheme(CHAIN);
