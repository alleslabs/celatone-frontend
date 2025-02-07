import { CHAIN } from "env";
import { DEFAULT_THEME } from "./default";
import { INITIA_THEME } from "./initia";
import { SEI_THEME } from "./sei";
import { Option } from "lib/types";

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
