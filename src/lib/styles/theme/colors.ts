import type { ThemeConfig } from "config/theme/types";
import { CURR_THEME } from "env";

export const colors = { ...CURR_THEME.colors };

export const getColors = (theme: ThemeConfig) => {
  return { ...theme.colors };
};
