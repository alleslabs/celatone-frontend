import { CHAIN } from "env";
import type { Option } from "lib/types";
import { DEFAULT_THEME } from "./default";
import { INITIA_THEME } from "./initia";
import { SEI_THEME } from "./sei";

export const getTheme = (chain: Option<string>) => {
  switch (chain) {
    case "sei":
      return SEI_THEME;
    case "initia":
      return INITIA_THEME;
    default:
      return DEFAULT_THEME;
  }
};

export const FALLBACK_THEME = getTheme(CHAIN);
