import type { DeepPartial, Theme } from "@chakra-ui/react";

import { CURR_THEME } from "env";

export const fonts: DeepPartial<Theme["fonts"]> = {
  heading: CURR_THEME.fonts.heading.name,
  body: CURR_THEME.fonts.body.name,
  mono: CURR_THEME.fonts.mono.name,
};
