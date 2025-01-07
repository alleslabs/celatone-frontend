import { FALLBACK_CHAIN } from "env";

import { DEFAULT_THEME } from "./default";
import { INITIA_THEME } from "./initia";
import { SEI_THEME } from "./sei";

export const getTheme = (chain: string) => {
  switch (chain) {
    case "initia":
      return INITIA_THEME;
    case "sei":
      return SEI_THEME;
    default:
      return DEFAULT_THEME;
  }
};

export const FALLBACK_THEME = getTheme(FALLBACK_CHAIN);
