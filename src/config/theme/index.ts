import { CHAIN } from "env";
import type { Option } from "lib/types";
import { DEFAULT_THEME } from "./default";
import { INITIA_THEME } from "./initia";
import { SEI_THEME } from "./sei";

export const getTheme = (chain: Option<string>) => {
  if (chain?.includes("initia")) return INITIA_THEME;
  if (chain === "sei") return SEI_THEME;

  return DEFAULT_THEME;
};

export const FALLBACK_THEME = getTheme(CHAIN);
